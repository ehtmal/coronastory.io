/**
 * Corona Main Screen functions
 * Copyright 2020 Sinka Vietnam (https://sinka.vn)
 */

// Share global Controls
var $bypassDate = null;
var $globalSummary = null;

/** Class MainScreen */
var MainScreen = (function () {
  /** Constructor */
  function MainScreen() {
    // Init [BypassDate]
    $bypassDate = new BypassDate('#bypass-date');

    // Get data for display
    Repository.fetchData(MainScreen.assignDataCallback);
  }

  /** Repository fetch data done handler */
  MainScreen.assignDataCallback = function (data) {
    // Update [BypassDate]
    $bypassDate.updateTime(data.dateArray);
    $bypassDate.updateTimeIndex(0);

    // Init [GlobalSummary]
    $globalSummary = new GlobalSummary("#global-summary", data.globalData, data.dateArray);
    $globalSummary.update(0);    
  }

  return MainScreen;
})();

// Document ready init MainScreen
$(function () {
  Chart.platform.disableCSSInjection = true;
  Chart.defaults.global.defaultFontFamily = 'myFont';
  var mainScreen = new MainScreen();
});