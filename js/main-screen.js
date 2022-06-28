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
var $rankingBarMobile = null;
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
    // On Update language update all Stories language
    $(document).on('change', '.selectpicker', function (e) {
      $globalStoryManager.updateLanguage(e.target.value);
      $storyPlayer.updateStories($globalStoryManager.getAllStories());
    });

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

    // Global DetailsPopup events
    $(document).on('click', '.global-summary-item', function () {
      $countryModal.show('GLOBAL', 'glb', $storyPlayer.getTime());
    });

    // First-time Play button click
    $('.first-time-play-button').on('click', function () {
      // Marked as seen
      sessionStorage.setItem("isVisited", true);
      // Hide controls and start play
      $('.first-time .first-time-button').addClass('paused');
      $('.first-time .description').hide();
      $('.first-time .overlay').fadeOut(100);
      $('.first-time .first-time-play-button').addClass('move-to-top-left'); // 1s
      setTimeout(function () {
        $('.first-time .first-time-play-button').hide();
        $('.player').css("visibility", "visible");
        $('.leaflet-bar-timecontrol').css("visibility", "visible");
        $storyPlayer.start();
      }, 1000);
    });

    // Close help-popup when time-player finish
    $(document).on('click', '.js-close-overlay', function (e) {
      e.preventDefault();
      $('.help-popup').hide();
    });
    
  }

  /** Repository fetch data done handler */
  MainScreen.assignDataCallback = function (data) {
    // Init [StoryManager]
    var language = $('#language-picker').val();
    $globalStoryManager = new StoryManager("global", "default", "default", language, data.timeSeriesData);
    // Init [GlobalSummary]
    $globalSummary = new GlobalSummary("#global-summary", data.globalData, data.dateArray);
    $globalSummary.update(0);
    // Init [RankingBar]
    $rankingBar = new RankingBar('#ranking-container', "#story-player", data.timeSeriesData, data.sidebarData);
    $rankingBar.update(0);
    $rankingBarMobile = new RankingBar('#mobile-ranking-container', "#story-player", data.timeSeriesData, data.sidebarData, { enableSimpleBar: true });
    $rankingBarMobile.update(0);
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
    // Update [RankingBar]
    if ($(window).width() > MOBILE_RESOLUTION) {
      $rankingBar.update(timeIndex);
    } else {
      $rankingBarMobile.update(timeIndex);
    }
    // Update Map Locations
    $storyMap.updateLocationsByTime(timeIndex);
  }

  /** Check guest is visted website yet */
  MainScreen.prototype.visitedCheck = function () {
    let isVisited = sessionStorage.getItem("isVisited");
    if (isVisited == undefined || isVisited == false) {
      $('.first-time').css("visibility", "visible");
    }
    else {
      $('.player').css("visibility", "visible");
      $('.leaflet-bar-timecontrol').css("visibility", "visible");
    }
  }  

  return MainScreen;
})();

// Document ready init MainScreen
$(function () {
  Chart.platform.disableCSSInjection = true;
  Chart.defaults.global.defaultFontFamily = 'myFont';
  var mainScreen = new MainScreen();
  mainScreen.visitedCheck();
});