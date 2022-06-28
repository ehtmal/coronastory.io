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

    // Get data for display
    Repository.fetchData(MainScreen.assignDataCallback);
  }

  /** Repository fetch data done handler */
  MainScreen.assignDataCallback = function (data) {
    // Init [StoryManager]
    $globalStoryManager = new StoryManager("global", "default", "default", "en", data.timeSeriesData);
    // Init [GlobalSummary]
    $globalSummary = new GlobalSummary("#global-summary", data.globalData, data.dateArray);
    $globalSummary.update(0);

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