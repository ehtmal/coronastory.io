/**
 * Corona Main Screen functions
 * Copyright 2020 Sinka Vietnam (https://sinka.vn)
 */

// Share global Controls
var $bypassDate = null;
var $globalSummary = null;
var $globalStoryManager = null;
var $storyMap = null;
var $storyPlayer = null;
var $rankingBar = null;
var $countryModal = null;

/** Class MainScreen */
var MainScreen = (function () {
  /** Constructor */
  function MainScreen() {
    // Init [BypassDate]
    $bypassDate = new BypassDate('#bypass-date');
    // Init [StoryMap]
    $storyMap = new StoryMap("#global-map");
    // Init StoryPlayer
    $storyPlayer = new StoryPlayer("#story-player", $storyMap);

    this.bindingEvents();

    // Get data for display
    Repository.fetchData(MainScreen.assignDataCallback);
  }

  MainScreen.prototype.bindingEvents = function () {
    // Search RankingBar
    $('#search-box').on('keyup', Utility.debounce(function () {
      $rankingBar.search($(this).val());
    }, 200));

    // Global DetailsPopup events
    $(document).on('click', '.global-summary-item', function () {
      $countryModal.show('GLOBAL', 'glb', $storyPlayer.getTime());
    });

  }

  /** Repository fetch data done handler */
  MainScreen.assignDataCallback = function (data) {
    // Init [StoryManager]
    $globalStoryManager = new StoryManager("global", "default", "default", "en", data.timeSeriesData);
    // Init [GlobalSummary]
    $globalSummary = new GlobalSummary("#global-summary", data.globalData, data.dateArray);
    $globalSummary.update(0);
    // Init [RankingBar]
    $rankingBar = new RankingBar('#ranking-container', "#story-player", data.timeSeriesData, data.sidebarData);
    $rankingBar.update(0);
    // Init [CountryModal]
    $countryModal = new CountryModal("#country-modal", data.timeSeriesData, data.globalData, data.dateArray);

    // Update [BypassDate]
    $bypassDate.updateTime(data.dateArray);
    $bypassDate.updateTimeIndex(0);
    // Update [StoryPlayer]
    $storyPlayer.updateTime(data.dateArray);
    $storyPlayer.updateStories($globalStoryManager.getAllStories());
    $storyPlayer.timeDimension.on('timeload', MainScreen.timeloadCallback);
    $storyPlayer.player.on('animationfinished', function () {
      $('.help-popup').fadeIn(1500); // Show ending Popup on finished
    });
    // Update [StoryMap]
    $storyMap.updateTimeSeriesData(data.timeSeriesData);
    $storyMap.updateValueMinMax(data.valueMinMax);
    // Render Map Marker, Tooltip at first day
    for (country in data.timeSeriesData) {
      let station = STATION_DATA.find(function (obj) { return obj.name === country });
      $storyMap.generateStationData(data.timeSeriesData, country, station);
    }
  }

  /** TimeDimension timeload event handler */
  MainScreen.timeloadCallback = function (data) {
    let timeIndex = data.target._currentTimeIndex;

    // Update [GlobalSummary]
    $globalSummary.update(timeIndex);
    // Update [BypassDate]
    $bypassDate.updateTimeIndex(timeIndex);
    // Update RankingBar
    $rankingBar.update(timeIndex);
    // Update Map Locations
    $storyMap.updateLocationsByTime(timeIndex);
  }

  return MainScreen;
})();

// Document ready init MainScreen
$(function () {
  Chart.platform.disableCSSInjection = true;
  Chart.defaults.global.defaultFontFamily = 'myFont';
  var mainScreen = new MainScreen();
});