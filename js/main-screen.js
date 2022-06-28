/**
 * Corona Main Screen functions
 * Copyright 2020 Sinka Vietnam (https://sinka.vn)
 */

// Share global Controls
var $bypassDate = null;

/** Class MainScreen */
var MainScreen = (function () {
  /** Constructor */
  function MainScreen() {
    // Init BypassDate
    $bypassDate = new BypassDate('#bypass-date');

    // Get data for display
    Repository.fetchData(MainScreen.assignDataCallback);
  }

  /** Repository fetch data done handler */
  MainScreen.assignDataCallback = function (data) {
    // Update BypassDate
    $bypassDate.updateTime(data.dateArray);
    $bypassDate.updateTimeIndex(0);
  }

  return MainScreen;
})();

// Document ready init MainScreen
$(function () {
  var mainScreen = new MainScreen();
});