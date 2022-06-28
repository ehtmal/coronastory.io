/**
 * Corona Story Studio Screen functions
 * Copyright 2020 Sinka Vietnam (https://sinka.vn)
 */

// Share global Controls
var $globalStoryManager = null;
var $storyMap = null;
var $storyPlayer = null;
var $countryModal = null;
var $bypassDate = null;
var $globalSummary = null;
var $rankingBar = null;
var $rankingBarMobile = null;

/** Class StoryStudioScreen */
var StoryStudioScreen = (function () {

  /** Constructor */
  function StoryStudioScreen() {
    // Init StoryMap
    $storyMap = new StoryMap("#global-map");

    // Init StoryPlayer
    $storyPlayer = new StoryPlayer("#story-player", $storyMap);

    // Init BypassDate
    $bypassDate = new BypassDate('#bypass-date');

    // Binding events
    this.bindingEvents();

    // Get data for display
    Repository.fetchData(StoryStudioScreen.assignDataCallback);

    // Set local storage visited story studio
    localStorage.setItem('isVisitedStoryStudio', true);
  }

  /** Binding events */
  StoryStudioScreen.prototype.bindingEvents = function () {
    // Action when click search box in mobile.
    $('#mobile-ranking #search-box-mobile').on('focus', function () {
      $('#mobile-ranking').addClass('show');
    });
    // Action when close search results.
    $('#mobile-ranking .btn-close').on('click', function () {
      $('#mobile-ranking').removeClass('show');
    });
    // Search RankingBar PC
    $('#search-box').on('keyup', Utility.debounce(function () {
      $rankingBar.search($(this).val());
      $('#search-box-mobile').val($(this).val());
    }, 200));
    // Search RankingBar mobile
    $('#mobile-ranking #search-box-mobile').on('keyup', Utility.debounce(function () {
      $rankingBarMobile.search($(this).val());
      $('#search-box').val($(this).val());
    }, 200));

    //#region Map Settings
    // Select a Prefix Setting
    $('.config-item.setting').on('click', function () {
      let setting = window[$(this).data('setting')];

      // Update rules
      $globalStoryManager.updateRuleName(setting.ruleName);
      ManagerAutoStory.renderRules();

      // Update stories
      $globalStoryManager.updateStoryName(setting.storyName);
      ManagerManualStory.renderStories();

      // Update map tile
      localStorage.setItem('cs-map-tile', setting.config.tile);
      $storyMap.updateMapTile();

      // Update display item
      let item = setting.config.item;
      localStorage.setItem('cs-item-selected', item);
      $storyMap.displayValue = item;

      // Update range
      let my_range = $(".js-range-slider").data("ionRangeSlider");
      my_range.update({ from: setting.config.radius[0], to: setting.config.radius[1] });
      localStorage.setItem('cs-radius-range', JSON.stringify([setting.config.radius[0], setting.config.radius[1]]));

      // Update camera
      // $storyMap.map.setView(setting.camera.center, setting.camera.zoom);

      // Update player
      $storyPlayer.updateStories($globalStoryManager.getAllStories());
      if (setting.camera.date) $storyPlayer.timeDimension.setCurrentTime(setting.camera.date);
      $storyPlayer.start();

      notify('success', 'Successfully');
    });

    // Select a map tile
    $('.config-item.map-tile').on('click', function () {
      let map = $(this).data('map');
      localStorage.setItem('cs-map-tile', map);
      $storyMap.updateMapTile();
      notify('success', 'Successfully');
    });

    // Select a display item
    $('.config-item.item-selected').on('click', function () {
      let item = $(this).data('item');
      localStorage.setItem('cs-item-selected', item);
      $storyMap.displayValue = item;
      $storyPlayer.start();
      notify('success', 'Successfully');
    });
    //#endregion

    //#region UI Events
    // On Update language update all Stories language
    $(document).on('change', '.selectpicker', function (e) {
      $globalStoryManager.updateLanguage(e.target.value);
      $storyPlayer.updateStories($globalStoryManager.getAllStories());
    });
    
    // Open & Close Story Studio board
    var isConfigOpened = false;
    $('#open-config-manager').on('click', function () {
      if (isConfigOpened) {
        $('.fa-chevron-right').css('transform', 'rotate(0deg)');
        $('.config-manager').removeClass('visible');
      } else {
        $('.config-manager').addClass('visible');
        $('.fa-chevron-right').css('transform', 'rotate(180deg)');
      }
      isConfigOpened = !isConfigOpened;
    });
    $(".config-manager .menu-container li a").on('click', function () {
      $(".config-manager .menu-container li").removeClass("active");
      $(this).parent().addClass("active");
    });

    // SHORTCODE help
    $('.help-center').popover({
      content: `<div class="help-center-container">
                  <div><span class="badge badge-primary">[ITEM]</span><span class="ml-2">Name of item</span></div>
                  <div><span class="badge badge-primary">[LOCATION]</span><span class="ml-2">Name of country</span></div>
                  <div><span class="badge badge-primary">[FLAG]</span><span class="ml-2">Flag of country</span></div>
                  <div><span class="badge badge-primary">[ICON]</span><span class="ml-2">Image of item</span></div>
                  <div><span class="badge badge-primary">[VALUE]</span><span class="ml-2">Real value at that time</span></div>
                  <div><span class="badge badge-primary">[DATE]</span><span class="ml-2">Present date</span></div>
                </div>`,
      placement: 'bottom',
      title: 'Some shortcode you can use',
      html: true,
      trigger: 'focus'
    });

    // Update CountryCode & LatLng when select Country
    $(document).on('change', 'select[name="countryName"]', function () {
      let code = $(this).find(':selected').data('code');
      let latlng = $(this).find(':selected').data('latlng');

      $(this).closest('form').find('input[name="countryCode"]').val(code);
      $(this).closest('form').find('input[name="latlng"]').val(JSON.stringify(latlng));
    });

    // Global DetailsPopup events
    $(document).on('click', '.global-summary-item', function () {
      $countryModal.show('GLOBAL', 'glb', $storyPlayer.getTime());
    });

    $('.player').css("visibility", "visible");
    $('.leaflet-bar-timecontrol').css("visibility", "visible");
    //#endregion
  }

  /** Repository fetch data done handler */
  StoryStudioScreen.assignDataCallback = function (data) {
    // Init StoryManager
    var language = $('#language-picker').val();
    $globalStoryManager = new StoryManager("global", "default", "default", language, data.timeSeriesData);

    // Init GlobalSummary
    $globalSummary = new GlobalSummary("#global-summary", data.globalData, data.dateArray);
    $globalSummary.update(0);

    // Init RankingBar
    $rankingBar = new RankingBar('#ranking-container', "#story-player", data.timeSeriesData, data.sidebarData);
    $rankingBar.update(0);
    $rankingBarMobile = new RankingBar('#mobile-ranking-container', "#story-player", data.timeSeriesData, data.sidebarData, { enableSimpleBar: false });
    $rankingBarMobile.update(0);

    // Init CountryModal
    $countryModal = new CountryModal("#country-modal", data.timeSeriesData, data.globalData, data.dateArray);

    // Init AutoStory Manager
    this.managerAutoStory = new ManagerAutoStory("#auto-story-manager");

    // Init ManualStory Manager
    this.managerManualStory = new ManagerManualStory("#manual-story");
    
    // Update StoryPlayer
    $storyPlayer.updateTime(data.dateArray);
    $storyPlayer.updateStories($globalStoryManager.getAllStories());
    $storyPlayer.timeDimension.on('timeload', StoryStudioScreen.timeloadCallback);

    // Update BypassDate
    $bypassDate.updateTime(data.dateArray);
    $bypassDate.updateTimeIndex(0);
    
    // Update Map
    $storyMap.updateTimeSeriesData(data.timeSeriesData);
    $storyMap.updateValueMinMax(data.valueMinMax);
    // Render marker, tooltip at first day
    for (country in data.timeSeriesData) {
      let station = STATION_DATA.find(function (obj) { return obj.name === country });
      $storyMap.generateStationData(data.timeSeriesData, country, station);
    }

    // Country Mode select country
    var previousCountry = null;
    $('.country-mode-item').on('click', function () {
      let countryName = $(this).data('country');
      var select = L.countrySelect('select-country');
      var countries = select.options.countries;
      var country = L.geoJson(countries[countryName]);
      if (previousCountry != null) {
        $storyMap.map.removeLayer(previousCountry);
      }
      previousCountry = country;

      $storyMap.map.addLayer(country);
      $storyMap.map.fitBounds(country.getBounds());
      notify('success', 'Successfully');
    });

    // Get radius, assign and init slider
    let cacheRadiusRange = JSON.parse(localStorage.getItem('cs-radius-range'));
    if (cacheRadiusRange) {
      $storyMap.minRadius = cacheRadiusRange[0];
      $storyMap.maxRadius = cacheRadiusRange[1];
    }
    // Binding radius range slider
    $('.js-range-slider').ionRangeSlider({
      skin: "flat",
      type: "double",
      min: 0,
      max: 200,
      from: $storyMap.minRadius,
      to: $storyMap.maxRadius,
      onFinish: function (data) {
        $storyMap.minRadius = data.from;
        $storyMap.maxRadius = data.to;
        localStorage.setItem('cs-radius-range', JSON.stringify([$storyMap.minRadius, $storyMap.maxRadius]));
      }
    });

    // Loop country to render Country Select
    for (country in data.timeSeriesData) {
      let station = STATION_DATA.find(function (obj) { return obj.name === country });
      $('.story-item-tmp select[name="countryName"]').append(
        '<option value="' + station.name + '" data-code="' + station.country_code + '" data-latlng="' + JSON.stringify(station.latlng) + '">' + station.name + '</option>'
      );
    }
  }

  /** TimeDimension timeload event handler */
  StoryStudioScreen.timeloadCallback = function (data) {
    let timeIndex = data.target._currentTimeIndex;
    // Update Global Summary
    $globalSummary.update(timeIndex);

    // Update Bypass Date
    $bypassDate.updateTimeIndex(timeIndex);

    // Update Map Locations
    $storyMap.updateLocationsByTime(timeIndex);

    // Update RankingBar
    if ($(window).width() > MOBILE_RESOLUTION) {
      $rankingBar.update(timeIndex);
    } else {
      $rankingBarMobile.update(timeIndex);
    }
  }

  return StoryStudioScreen;
})();

$(function () {
  var screen = new StoryStudioScreen();
});

/** Init Icheck */
function initIcheck(selector) {
  $(selector).iCheck({
    checkboxClass: 'icheckbox_flat-green',
    radioClass: 'iradio_flat-green'
  });
}

/** Init Sweet Alert object */
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

/** Notify with Sweet Alert */
function notify(type, message) {
  Toast.fire({
    icon: type,
    title: message
  });
}