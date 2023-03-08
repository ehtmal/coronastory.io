/** Class CountryModal */
var CountryModal = (function () {

  /** Constructor */
  function CountryModal(selector, timeSeriesData, globalData, dateArray) {
    this.$container = $(selector);
    this.$container.data("modal", this);
    this.ARROW_IMAGES = {
      INCREASE: '<img src="images/icons/arrowup.png" class="img-icon">',
      DECREASE: '<img src="images/icons/arrowdown.png" class="img-icon">',
      NOCHANGE: '<img src="images/icons/minus.png" class="img-icon">'
    };
    this.timeSeriesData = timeSeriesData;
    this.globalData = globalData;
    this.dateArray = dateArray;

    // Set startdate & enddate for datepicker
    this.$container.find('.current-date').datepicker('setStartDate', this.dateArray[0]);
    this.$container.find('.current-date').datepicker('setEndDate', this.dateArray[this.dateArray.length - 1]);

    // Init Timeseries charts
    this.lineChart = this.generateLineChart();
    this.$container.find('.js-line-chart-legend').html(this.lineChart.generateLegend());
    this.barChart = this.generateBarChart();
    this.$container.find('.js-bar-chart-legend').html(this.barChart.generateLegend());
    this.$seekbar = new SeekBar('#day-player', {min: 0, max: this.dateArray.length - 1})
    this.$pictogram = new Pictogram('.js-human-chart');

    this.bindingEvents();
  }

  /** Binding events for HTML */
  CountryModal.prototype.bindingEvents = function () {
    var self = this;

    // Datepicker events (pick, next, previous)
    this.$container.find('.current-date').off('pick.datepicker').on('pick.datepicker', function (e) {
      $countryModal.pick(DateUtility.formatDate(e.date));
      self.$seekbar.setPosition(self.dateArray.indexOf(DateUtility.formatDate(e.date)));
    });
    this.$container.find('.date-count .previous').off('click').on('click', function () {
      let date = self.$container.find('.current-date').datepicker('getDate');
      date.setDate(date.getDate() - 1);
      if (self.dateArray.indexOf(DateUtility.formatDate(date)) == -1) return;
      self.$container.find('.current-date').datepicker('setDate', date);
      self.$seekbar.setPosition(self.dateArray.indexOf(DateUtility.formatDate(date)));
    });
    this.$container.find('.date-count .next').off('click').on('click', function () {
      let date = self.$container.find('.current-date').datepicker('getDate');
      date.setDate(date.getDate() + 1);
      if (self.dateArray.indexOf(DateUtility.formatDate(date)) == -1) return;
      self.$container.find('.current-date').datepicker('setDate', date);
      self.$seekbar.setPosition(self.dateArray.indexOf(DateUtility.formatDate(date)));
    });

    // Toggle legend show/hide item
    this.$container.on('click', '.custom-legend li', function (event) {
      event = event || window.event;
      var target = event.target || event.srcElement;
      while (target.nodeName !== 'LI') {
        target = target.parentElement;
      }
      var parent = target.parentElement;
      var chartId = parseInt(parent.classList[0].split("-")[0], 10);
      var chart = Chart.instances[chartId];
      var index = Array.prototype.slice.call(parent.children).indexOf(target);
      var meta = chart.getDatasetMeta(index);
      if (meta.hidden === null) {
        meta.hidden = !chart.data.datasets[index].hidden;
        target.classList.add('hidden');
      }
      else {
        target.classList.remove('hidden');
        meta.hidden = null;
      }
      chart.update();
    });

    // Caculate icon marker position when modal displayed
    this.$container.on('shown.bs.modal', function () {
      self.$seekbar.renderMarkers();
      self.$pictogram.render();
    })
    // Change postion in day player
    this.$seekbar.$container.on('change', 'input', function(e) {
      var dateIndex = e.target.value;
      let date = self.dateArray[dateIndex];
      self.$container.find('.current-date').datepicker('setDate', date);
    });
  }

  /** Show modal */
  CountryModal.prototype.show = function (countryName, countryCode, currentDate) {
    var self = this;
    // Set first case vs first death positions marker
    var manuals = $globalStoryManager.getManualsByCountry(countryCode);
    manuals.forEach(function(story) {
      story.pos = self.dateArray.indexOf(DateUtility.formatDate(story.date));
    });
    this.$seekbar.manualStories = manuals;
    var autos = $globalStoryManager.getAutoStoriesByCountry(countryName).filter(function(story) {return story.type == 'confirmed' || story.type == 'deaths' || story.type == 'active' || story.type == 'recovered'});
    autos.forEach(function(story) {
      story.pos = self.dateArray.indexOf(DateUtility.formatDate(story.date));
    });
    this.$seekbar.autoStories = autos;
    
    // Render statistic info
    this.countryName = countryName;
    this.$container.find('.flag .country-name').text(countryName);
    this.$container.find('.flag').attr('title', countryName);
    var url = FLAGS_URL.replace('{countryCode}', countryCode);
    this.$container.find('.flag').css('--url', 'url(' + url + ')');
    if (countryName === 'GLOBAL' ||   countryName === 'Winter Olympics 2022')
      this.$container.find('.flag').css('background-size', 'contain');
    else
      this.$container.find('.flag').css('background-size', 'cover');
    this.$container.find('.current-date').datepicker('setDate', currentDate);
    this.$seekbar.setPosition(self.dateArray.indexOf(DateUtility.formatDate(currentDate)));

    // Render chartJS
    var countryData = countryName === 'GLOBAL' ? this.globalData : this.timeSeriesData[countryName];
    var countryConfirmed = countryData.map(function (obj) { return obj.confirmed; });
    var countryActive = countryData.map(function (obj) { return obj.active; });
    var countryRecovered = countryData.map(function (obj) { return obj.recovered; });
    var countryDeaths = countryData.map(function (obj) { return obj.deaths; });
    // let dailyConfirmed = countryData.map(obj => obj.dailyConfirmed);
    var dailyActive = countryData.map(function (obj) { return obj.dailyActive; });
    var dailyRecovered = countryData.map(function (obj) { return obj.dailyRecovered; });
    var dailyDeaths = countryData.map(function (obj) { return obj.dailyDeaths; });
    this.lineChart.data.datasets[0].data = countryConfirmed;
    this.lineChart.data.datasets[1].data = countryActive;
    this.lineChart.data.datasets[2].data = countryRecovered;
    this.lineChart.data.datasets[3].data = countryDeaths;
    // this.barChart.data.datasets[0].data = dailyConfirmed;
    this.barChart.data.datasets[0].data = dailyActive;
    this.barChart.data.datasets[1].data = dailyRecovered;
    this.barChart.data.datasets[2].data = dailyDeaths;
    this.lineChart.update({ duration: 0 });
    this.barChart.update({ duration: 0 });
    this.$container.modal('show');
  };

  /** Display selected date */
  CountryModal.prototype.pick = function (currentDate) {
    var countryName = this.countryName;
    var timeIndex = this.dateArray.findIndex(function (date) { return date === currentDate; });
    var timeData = countryName === 'GLOBAL' ? this.globalData[timeIndex] : this.timeSeriesData[countryName][timeIndex];

    // Update statistic
    this.$container.find('.js-confirmed-count').text(NumberUtility.formatNumber(timeData.confirmed));
    this.$container.find('.js-active-count').text(NumberUtility.formatNumber(timeData.active));
    this.$container.find('.js-recovered-count').text(NumberUtility.formatNumber(timeData.recovered));
    this.$container.find('.js-deaths-count').text(NumberUtility.formatNumber(timeData.deaths));

    if (timeData.dailyConfirmed > 0)
      this.$container.find('.js-daily-confirmed-arrow').html(this.ARROW_IMAGES.INCREASE);
    else if (timeData.dailyConfirmed < 0)
      this.$container.find('.js-daily-confirmed-arrow').html(this.ARROW_IMAGES.DECREASE);
    else
      this.$container.find('.js-daily-confirmed-arrow').html(this.ARROW_IMAGES.NOCHANGE);

    if (timeData.dailyActive > 0)
      this.$container.find('.js-daily-active-arrow').html(this.ARROW_IMAGES.INCREASE);
    else if (timeData.dailyActive < 0)
      this.$container.find('.js-daily-active-arrow').html(this.ARROW_IMAGES.DECREASE);
    else
      this.$container.find('.js-daily-active-arrow').html(this.ARROW_IMAGES.NOCHANGE);

    if (timeData.dailyRecovered > 0)
      this.$container.find('.js-daily-recovered-arrow').html(this.ARROW_IMAGES.INCREASE);
    else if (timeData.dailyRecovered < 0)
      this.$container.find('.js-daily-recovered-arrow').html(this.ARROW_IMAGES.DECREASE);
    else
      this.$container.find('.js-daily-recovered-arrow').html(this.ARROW_IMAGES.NOCHANGE);

    if (timeData.dailyDeaths > 0)
      this.$container.find('.js-daily-deaths-arrow').html(this.ARROW_IMAGES.INCREASE);
    else if (timeData.dailyDeaths < 0)
      this.$container.find('.js-daily-deaths-arrow').html(this.ARROW_IMAGES.DECREASE);
    else
      this.$container.find('.js-daily-deaths-arrow').html(this.ARROW_IMAGES.NOCHANGE);

    this.$container.find('.js-daily-confirmed-count').text((timeData.dailyConfirmed >= 0 ? "+" : "") + NumberUtility.formatNumber(timeData.dailyConfirmed));
    this.$container.find('.js-daily-active-count').text((timeData.dailyActive >= 0 ? "+" : "") + NumberUtility.formatNumber(timeData.dailyActive));
    this.$container.find('.js-daily-recovered-count').text((timeData.dailyRecovered >= 0 ? "+" : "") + NumberUtility.formatNumber(timeData.dailyRecovered));
    this.$container.find('.js-daily-deaths-count').text((timeData.dailyDeaths >= 0 ? "+" : "") + NumberUtility.formatNumber(timeData.dailyDeaths));

    // Calculate Percent daily data
    this.$container.find('.js-daily-confirmed-percent').text(timeData.confirmed === 0 ? '0.00%' : ((timeData.confirmed / timeData.confirmed * 100).toFixed(2) + '%'));
    this.$container.find('.js-daily-active-percent').text(timeData.confirmed === 0 ? '0.00%' : ((timeData.active / timeData.confirmed * 100).toFixed(2) + '%'));
    this.$container.find('.js-daily-recovered-percent').text(timeData.confirmed === 0 ? '0.00%' : ((timeData.recovered / timeData.confirmed * 100).toFixed(2) + '%'));
    this.$container.find('.js-daily-deaths-percent').text(timeData.confirmed === 0 ? '0.00%' : ((timeData.deaths / timeData.confirmed * 100).toFixed(2) + '%'));

    // Calendar update
    var countDate = DateUtility.getJoiningDates(this.timeSeriesData, countryName, this.dateArray).indexOf(currentDate) + 1;
    this.$container.find('.js-date-count-text').text(countDate);

    // Pictogram update
    this.$pictogram.activeCount = timeData.active / 1000;
    this.$pictogram.recoveredCount = timeData.recovered / 1000;
    this.$pictogram.deathsCount = timeData.deaths / 1000;
    if (this.$container.hasClass('show')) {
      this.$pictogram.render();
    }
  };

  /** Generate LineChart with config */
  CountryModal.prototype.generateLineChart = function () {
    var dateAxes = DateUtility.getAxesDates(this.dateArray);
    var linectx = this.$container.find('.js-line-chart')[0].getContext('2d');
    return new Chart(linectx, {
      type: 'line',
      data: {
        labels: dateAxes,
        datasets: [{
          label: 'Confirmed',
          backgroundColor: 'rgba(255, 65, 108, 0.2)',
          borderColor: 'rgb(255, 65, 108)',
          data: []
        }, {
          label: 'Active',
          backgroundColor: 'rgba(40, 110, 255, 0.2)',
          borderColor: 'rgb(40, 110, 255)',
          data: []
        }, {
          label: 'Recovered',
          backgroundColor: 'rgba(97, 206, 129, 0.2)',
          borderColor: 'rgb(97, 206, 129)',
          data: []
        }, {
          label: 'Deaths',
          backgroundColor: 'rgba(134, 67, 230, 0.2)',
          borderColor: 'rgb(134, 67, 230)',
          data: []
        }]
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          enabled: false,
          mode: 'nearest',
          intersect: false,
          axis: 'x',
          custom: function (tooltipModel) { CountryModal.customTooltip(tooltipModel, '.line-chart', this); },
        },
        hover: {
          mode: 'nearest',
          intersect: false,
          axis: 'x',
          animationDuration: 0
        },
        elements: { point: { radius: 0 } },
        legend: { display: false },
        legendCallback: CountryModal.legendCallback,
        scales: {
          xAxes: [{ gridLines: { display: false } }],
          yAxes: [{
            ticks: {
              callback: function (value, index, labels) {
                return NumberUtility.shorter(value);
              }
            }
          }]
        }
      }
    });
  }

  /** Generate BarChart with config */
  CountryModal.prototype.generateBarChart = function () {
    var dateAxes = DateUtility.getAxesDates(this.dateArray);
    var barctx = this.$container.find('.js-bar-chart')[0].getContext('2d');
    return new Chart(barctx, {
      type: 'bar',
      data: {
        labels: dateAxes,
        datasets: [{
          label: 'Active',
          backgroundColor: 'rgb(40, 110, 255)',
          data: []
        }, {
          label: 'Recovered',
          backgroundColor: 'rgb(97, 206, 129)',
          data: []
        }, {
          label: 'Deaths',
          backgroundColor: 'rgb(134, 67, 230)',
          data: []
        }]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [{ stacked: true, gridLines: { display: false } }],
          yAxes: [{
            stacked: true,
            ticks: {
              callback: function (label, index, labels) {
                return NumberUtility.shorter(label);
              }
            }
          }]
        },
        tooltips: {
          enabled: false,
          mode: 'nearest',
          intersect: false,
          axis: 'x',
          custom: function (tooltipModel) { CountryModal.customTooltip(tooltipModel, '.bar-chart', this); },
          callbacks: {
            label: function (tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label || '';
              if (label)
                label += ': ';
              label += (tooltipItem.yLabel >= 0 ? '+' : '') + tooltipItem.yLabel;
              return label;
            }
          }
        },
        hover: {
          mode: 'nearest',
          intersect: false,
          axis: 'x',
          animationDuration: 0
        },
        legend: { display: false },
        legendCallback: CountryModal.legendCallback
      }
    });
  }

  /** Return legend HTML string */
  CountryModal.legendCallback = function (chart) {
    var text = [];
    text.push('<ul class="' + chart.id + '-legend">');
    for (var i = 0; i < chart.data.datasets.length; i++) {
      text.push('<li class="' + chart.data.datasets[i].label.toLowerCase() + '">');
      if (chart.data.datasets[i].label) {
        text.push(chart.data.datasets[i].label);
      }
      text.push('</li>');
    }
    text.push('</ul>');
    return text.join('');
  }

  /** Build custom tooltip */
  CountryModal.customTooltip = function (tooltip, selector, $this) {
    // Tooltip Element
    var tooltipEl = document.querySelector(selector + ' .chartjs-tooltip');
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.className = 'chartjs-tooltip';
      tooltipEl.innerHTML = '<table></table>';
      $this._chart.canvas.parentNode.appendChild(tooltipEl);
    }
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }
    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltip.yAlign) {
      tooltipEl.classList.add(tooltip.yAlign);
    }
    else {
      tooltipEl.classList.add('no-transform');
    }
    function getBody(bodyItem) {
      return bodyItem.lines[0];
    }
    // Set Text
    if (tooltip.body) {
      var titleLines = tooltip.title || [];
      var bodyLines = tooltip.body.map(getBody);
      var innerHtml = '<thead>';
      titleLines.forEach(function (title) {
        innerHtml += '<tr><th>' + title + '</th></tr>';
      });
      innerHtml += '</thead><tbody>';
      bodyLines.forEach(function (body, i) {
        innerHtml += '<tr class="' + body.split(':')[0].toLowerCase() + '"><td><span class="icon"></span>' + body.split(':')[0] + ':' + NumberUtility.formatNumber(body.split(':')[1]) + '</td></tr>';
      });
      innerHtml += '</tbody>';
      var tableRoot = tooltipEl.querySelector('table');
      tableRoot.innerHTML = innerHtml;
    }
    var positionY = $this._chart.canvas.offsetTop;
    var positionX = $this._chart.canvas.offsetLeft;
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = '8px';
    // tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
    tooltipEl.style.fontSize = '12px';
    // tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
    tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
  }

  return CountryModal;
})();
