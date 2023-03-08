/** Class Story */
var StoryMap = (function () {
  /** Constructor */
  function StoryMap(selector) {
    let self = this;
    this.$container = $(selector);
    this.$container.addClass("story-map").data("story-map", this);
    this.minRadius = 4;
    this.maxRadius = 90;
    this.displayValue = "confirmed";
    this.timeSeriesData = {};
    this.valueMinMax = { confirmed: [0, 1], active: [0, 1], recovered: [0, 1], deaths: [0, 1] };

    // Init Leaflet Map
    let center = [0, 0];
    if ($(window).width() <= MOBILE_RESOLUTION) {
      center = [25, 75];
    }
    this.map = L.map(selector.replace("#", ""), {
      renderer: L.canvas(),
      zoomControl: false,
      worldCopyJump: true,
      maxBounds: [
        [85, 10000],
        [-85, -10000],
      ],
      minZoom: 2,
      zoom: 2,
      center: center,
      preferCanvas: true,
    });

    // Load Item Selected from LocalStorage
    let cacheItemSelected = localStorage.getItem("cs-item-selected");
    if (cacheItemSelected) this.displayValue = cacheItemSelected;

    // Update Map Tile
    this.updateMapTile();

    // Spread sidebar event to circleMarker (mousein, mouseout, click)
    $(document).on("mouseenter", ".country-item", function () {
      let countryName = $(this).data("country");
      self.map.eachLayer(function (layer) {
        if (layer.options.className === "mymarker" && layer.options.countryName === countryName)
          layer.fire("mouseover");
      });
    });
    $(document).on("mouseleave", ".country-item", function () {
      let countryName = $(this).data("country");
      self.map.eachLayer(function (layer) {
        if (
          layer.options.className === "mymarker" &&
          layer.options.countryName === countryName
        )
          layer.fire("mouseout");
      });
    });
    $(document).on("click", ".country-item", function () {
      let countryName = $(this).data("country");
      self.map.eachLayer(function (layer) {
        if (
          layer.options.className === "mymarker" &&
          layer.options.countryName === countryName
        )
          layer.fire("click");
      });
    });
  }

  /** Get Display Color base on current Display Value */
  StoryMap.prototype.getDisplayColor = function () {
    return ITEMS_COLOR[this.displayValue];
  };

  /** Update Timeseries data */
  StoryMap.prototype.updateTimeSeriesData = function (timeSeriesData) {
    this.timeSeriesData = timeSeriesData;
  };

  /** Update Map Tile */
  StoryMap.prototype.updateMapTile = function () {
    let cacheTile = localStorage.getItem("cs-map-tile");
    // Load Map Tile from LocalStorage
    if (!cacheTile) {
      cacheTile = "https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
      localStorage.setItem("cs-map-tile", cacheTile);
    }

    // Update Map Tile for Leaflet Map
    this.map.eachLayer(function (layer) {
      if (layer.options.id == "mytile") {
        layer.setUrl(cacheTile);
        return;
      }
    });

    L.tileLayer(cacheTile, { id: "mytile" }).addTo(this.map);
  };

  /** Update Map Min Max value */
  StoryMap.prototype.updateValueMinMax = function (valueMinMax) {
    this.valueMinMax = valueMinMax;
  };

  /** Calculate Radius base on value */
  StoryMap.prototype.calculateRadius = function (value) {
    if (isNaN(value) || value === 0) return 0;
    return Math.round(
      ((value - this.valueMinMax[this.displayValue][0]) /
        this.valueMinMax[this.displayValue][1]) *
        (this.maxRadius - this.minRadius) +
        this.minRadius
    );
  };

  /** Init circlemarker on map at first day */
  StoryMap.prototype.generateStationData = function (timeSeriesData, country, station) {
    let radius = this.calculateRadius(timeSeriesData[country][0][this.displayValue]);
    let color = this.getDisplayColor();
    let marker;
    if (country === "MS Zaandam" || country === "Diamond Princess" || country == "Summer Olympics 2020" || country == "Winter Olympics 2022") {
      marker = L.marker(station.latlng, {
        icon: L.icon({
          iconUrl: `images/flags/${
            country === "MS Zaandam" ? "mszaandam" : country === "Diamond Princess" ? "diamondprincess" : country == "Summer Olympics 2020" ?  "olympics" : 'winterolympics2022'
          }.svg`,
          iconSize: [radius ? 20 : 0, radius ? 20 : 0],
        }),
        // opacity: 0.4,
        className: "mymarker",
        countryName: country,
        countryCode: station.country_code,
      }).addTo(this.map);
    } else {
      // create marker, bind tooltip, event handler (mousein, mouseout, click)
      marker = L.circleMarker(station.latlng, {
        fill: radius > 0,
        stroke: radius > 0,
        radius,
        color,
        weight: 3,
        fillOpacity: 0.4,
        className: "mymarker",
        countryName: country,
        countryCode: station.country_code,
      }).addTo(this.map);
      marker.on("mouseover", function (e) {
        marker.setStyle({ fillOpacity: 1 });
      });
      marker.on("mouseout", function (e) {
        marker.setStyle({ fillOpacity: 0.4 });
      });
    }

    let tooltipHtml = this.buildTooltipHtml(country, station.country_code, 0);
    marker.bindTooltip(tooltipHtml, { direction: "center", offset: [-115, -150], className: "mytooltip" });
    marker.on("click", function (e) {
      // TODO: pass $countryModal & $storyPlayer as object when create somehow...
      if ($countryModal)
        $countryModal.show(
          this.options.countryName,
          this.options.countryCode,
          $storyPlayer.getTime()
        );
    });
  };

  /** Update all Locations: tooltips, raidus, hide/show, weight, color */
  StoryMap.prototype.updateLocationsByTime = function (timeIndex) {
    let self = this;
    this.map.eachLayer(function (layer) {
      if (layer.options.className === "mymarker") {
        // Update Map Marker only
        let country = layer.options.countryName;
        let countryCode = layer.options.countryCode;
        let tooltipHtml = self.buildTooltipHtml(country, countryCode, timeIndex);
        layer.setTooltipContent(tooltipHtml);

        let radius = self.calculateRadius(self.timeSeriesData[country][timeIndex][self.displayValue]);
        let color = self.getDisplayColor();
        if (country === "MS Zaandam" || country === "Diamond Princess" || country == "Summer Olympics 2020" || country == "Winter Olympics 2022") {
          layer.setIcon(
            L.icon({
              iconUrl: `images/flags/${
                country === "MS Zaandam" ? "mszaandam" : country === "Diamond Princess" ? "diamondprincess" : country == "Summer Olympics 2020" ?  "olympics" : 'winterolympics2022'
              }.svg`,
              iconSize: [radius ? 20 : 0, radius ? 20 : 0],
            })
          );
        } else {
          layer.setRadius(radius);
          layer.setStyle({
            fill: radius > 0,
            stroke: radius > 0,
            color,
          });
        }
      }
    });
  };

  /** Build Location tooltip */
  StoryMap.prototype.buildTooltipHtml = function (country, countryCode, timeIndex) {
    let flag = FLAGS_URL.replace("{countryCode}", countryCode);
    let timeData = this.timeSeriesData[country][timeIndex];
    let dailyConfirmed = Math.abs(timeData.dailyConfirmed);
    let dailyActive = Math.abs(timeData.dailyActive);
    let dailyRecovered = Math.abs(timeData.dailyRecovered);
    let dailyDeaths = Math.abs(timeData.dailyDeaths);
    let style = ''
    if(flag.includes('winterolympics2022')) style = 'background-size: contain;'
    let tooltipHtml =
      '<div class="tooltip-container">' +
        '<div class="flag" style="--url: url(' + flag + ');'+style+'"></div>' +
        '<div class="country-name">' + country + "</div>" +
        '<div class="info-container">' +
        '<div class="info-item confirmed">' +
        '<div class="left">' +
        '<div class="icon"></div>' +
        '<div class="content">' +
        '<div class="number numberFont">' + NumberUtility.formatNumber(timeData.confirmed) + "</div>" +
        '<div class="text">Confirmed</div>' +
        "</div>" +
        "</div>" +
        '<div class="right">' +
        "<span>" + (timeData.dailyConfirmed >= 0 ? "+" : "-") + NumberUtility.formatNumber(dailyConfirmed) + "</span>" +
        "</div>" +
        "</div>" +
        '<div class="info-item active">' +
        '<div class="left">' +
        '<div class="icon"></div>' +
        '<div class="content">' +
        '<div class="number numberFont">' + NumberUtility.formatNumber(timeData.active) + "</div>" +
        '<div class="text">Active</div>' +
        "</div>" +
        "</div>" +
        '<div class="right">' +
        "<span>" + (timeData.dailyActive >= 0 ? "+" : "-") + NumberUtility.formatNumber(dailyActive) + "</span>" +
        "</div>" +
        "</div>" +
        '<div class="info-item recovered">' +
        '<div class="left">' +
        '<div class="icon"></div>' +
        '<div class="content">' +
        '<div class="number numberFont">' + NumberUtility.formatNumber(timeData.recovered) + "</div>" +
        '<div class="text">Recovered</div>' +
        "</div>" +
        "</div>" +
        '<div class="right">' +
        "<span>" + (timeData.dailyRecovered >= 0 ? "+" : "-") + NumberUtility.formatNumber(dailyRecovered) + "</span>" +
        "</div>" +
        "</div>" +
        '<div class="info-item deaths">' +
        '<div class="left">' +
        '<div class="icon"></div>' +
        '<div class="content">' +
        '<div class="number numberFont">' + NumberUtility.formatNumber(timeData.deaths) + "</div>" +
        '<div class="text">Deaths</div>' +
        "</div>" +
        "</div>" +
        '<div class="right">' +
        "<span>" + (timeData.dailyDeaths >= 0 ? "+" : "-") + NumberUtility.formatNumber(dailyDeaths) + "</span>" +
        "</div>" +
        "</div>" +
        "</div>" +
      "</div>";
    return tooltipHtml;
  };

  /** Calculate Location Stroke */
  StoryMap.calculateStroke = function (value) {
    if (isNaN(value) || value === 0) return 0;
    return 3;
  };

  return StoryMap;
})();
