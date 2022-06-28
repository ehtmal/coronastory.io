/** Class StoryPlayer */
var StoryPlayer = (function () {

  /** Constructor */
  function StoryPlayer(selector, storyMap, stories = [], dates = []) {
    // Properties
    this.$container = $(selector);
    this.$container.addClass("story-player").data("story-player", this);
    this.$container.html(StoryPlayer.getTemplate());

    this.$playButton = this.$container.find('.play-button');
    this.$speedButton = this.$container.find('.speed-button');
    this.stories = stories;
    this.playing = false;

    // Init TimeDimension control
    this.timeDimension = new L.TimeDimension();
    this.player = new L.TimeDimension.Player({ transitionTime: PLAY_TIME.X1, loop: false, startOver: true }, this.timeDimension);
    this.timeDimensionControl = new L.control.timeDimension({
      timeDimension: this.timeDimension,
      player: this.player,
      timeSliderDragUpdate: false,
      backwardButton: false,
      forwardButton: false,
      playButton: false,
      displayDate: false,
      speedSlider: false
    });

    // Update time after init TimeDimension
    this.updateTime(dates);

    // Add control to Global Map
    storyMap.map.addControl(this.timeDimensionControl);

    this.bindingEvents(storyMap);
  }

  /** Binding events for HTML */
  StoryPlayer.prototype.bindingEvents = function (storyMap) {
    var self = this;

    // HTML controls events
    this.$container.find('.play-button').off('click.story-player').on('click.story-player', function () {
      if (self.isPlaying())
        self.stop();
      else
        self.start();
    });
    this.$container.find('.move-to-end-button').off('click.story-player').on('click.story-player', function () {
      if (self.isPlaying())
        self.stop();
      self.moveToEnd();
    });
    this.$container.find('.move-to-first-button').off('click.story-player').on('click.story-player', function () {
      if (self.isPlaying())
        self.stop();
      self.moveToFirst();
    });
    this.$container.find('.next-button').off('click.story-player').on('click.story-player', function () {
      self.moveNext();
    });
    this.$container.find('.previous-button').off('click.story-player').on('click.story-player', function () {
      self.movePrevious();
    });
    this.$container.find('.speed-button').off('click.story-player').on('click.story-player', function () {
      self.changeSpeed();
    });

    // TimePlayer finish animation
    this.player.on('animationfinished', function () {
      self.stop();
    });

    // TimePlayer update time
    this.timeDimension.on('timeload', function (data) {
      // Get list Story to display
      let storiesByDate = self.stories.filter(function (s) { return s.date == data.time; });
      let blockDurations = storiesByDate.map(function (s) { return s.block ? s.duration : 0; });
      let maxBlockDuration = Math.max.apply(Math, blockDurations);

      // Show list Story by date
      storiesByDate.forEach(function (story) {
        let animationTimeout = StoryPlayer.calculateAnimationTimeout(story, storiesByDate);
        story.show(animationTimeout, storyMap);
      });

      // Story block player
      if (maxBlockDuration != 0) {
        self.player.pause();
        setTimeout(function () { self.player.release(); }, maxBlockDuration);
      }

      // Update time slider background
      let posX = $('.timecontrol-slider .knob').css('transform').split(/[()]/)[1].split(',')[4];
      $('.timecontrol-slider .slider').css('background', 'linear-gradient(to right, #ffd4a2 0px, #ffd4a2 ' + posX + 'px, transparent ' + posX + 'px)');
    });

  }

  /** Update StoryPlayer with new stories */
  StoryPlayer.prototype.updateStories = function (stories) {
    this.stories = stories;
  };

  /** Update StoryPlayer with new stories */
  StoryPlayer.prototype.updateTime = function (dates) {
    this.dates = dates;
    // Reverse dateArray: bug on Firefox
    if (L.Browser.gecko)
      this.timeDimension.setAvailableTimes(dates.reverse(), 'replace');
    else
      this.timeDimension.setAvailableTimes(dates, 'replace');

    // Set time to first element
    this.timeDimension.setCurrentTime(dates[0]);
  };

  /** Get current time */
  StoryPlayer.prototype.getTime = function () {
    return this.timeDimension.getCurrentTime();
  };

  /** Get current time index */
  StoryPlayer.prototype.getTimeIndex = function () {
    return this.dates.findIndex(function (date) { return date === this.getTime(); });
  };

  /** Change StoryPlayer speed */
  StoryPlayer.prototype.changeSpeed = function () {
    var transitionTime = this.player.getTransitionTime();
    if (transitionTime == PLAY_TIME.X3) {
      this.$speedButton.removeClass('x4-fps');
      this.$speedButton.addClass('x1-fps');
      transitionTime = PLAY_TIME.X1;
    }
    else if (transitionTime == PLAY_TIME.X1) {
      this.$speedButton.removeClass('x1-fps');
      this.$speedButton.addClass('x2-fps');
      transitionTime = PLAY_TIME.X2;
    }
    else if (transitionTime == PLAY_TIME.X2) {
      this.$speedButton.removeClass('x2-fps');
      this.$speedButton.addClass('x4-fps');
      transitionTime = PLAY_TIME.X3;
    }
    this.player.setTransitionTime(transitionTime);
  };

  /** Check player is playing */
  StoryPlayer.prototype.isPlaying = function () {
    return this.playing;
  };

  /** Start */
  StoryPlayer.prototype.start = function () {
    this.$playButton.addClass('paused');
    this.playing = true;
    this.player.start();
  };

  /** Stop */
  StoryPlayer.prototype.stop = function () {
    this.$playButton.removeClass('paused');
    this.playing = false;
    this.player.stop();
  };

  /** Move to end */
  StoryPlayer.prototype.moveToEnd = function () {
    this.timeDimension.setCurrentTime(this.dates[this.dates.length - 1]);
  };

  /** Move to first */
  StoryPlayer.prototype.moveToFirst = function () {
    this.timeDimension.setCurrentTime(this.dates[0]);
  };

  /** Move next */
  StoryPlayer.prototype.moveNext = function () {
    this.timeDimension.nextTime(1);
  };

  /** Move previous */
  StoryPlayer.prototype.movePrevious = function () {
    this.timeDimension.previousTime(1);
  };

  //#region Static Methods
  /** Generate Bypass Date inner HTML */
  StoryPlayer.getTemplate = function () {
    return `<div class="player-control-button move-to-first-button"></div>
            <div class="player-control-button previous-button"></div>
            <div class="player-control-button play-button"></div>
            <div class="player-control-button next-button"></div>
            <div class="player-control-button move-to-end-button"></div>
            <div class="player-control-button speed-button x1-fps"></div>`;
  }

  /** Calculate Animation Timeout */
  StoryPlayer.calculateAnimationTimeout = function (story, stories) {
    if (story.type == 'global' || story.type == 'local') return 0;

    let sameLocation = stories.filter(s => s.countryName == story.countryName && s.type != 'local' && s.type != 'global');

    let distinctType = (sameLocation.map(function (s) {
      if (s.type == 'confirmed') return ['confirmed', 1];
      if (s.type == 'recovered') return ['recovered', 2];
      if (s.type == 'deaths') return ['deaths', 3];
      if (s.type == 'active') return ['active', 4];
      if (s.type == 'dailyConfirmed') return ['dailyConfirmed', 5];
      if (s.type == 'dailyRecovered') return ['dailyRecovered', 6];
      if (s.type == 'dailyDeaths') return ['dailyDeaths', 7];
      if (s.type == 'dailyActive') return ['dailyActive', 8];
      return '';
    })).filter(function (value, index, self) {
      return value !== '' && self.indexOf(value) === index;
    });
    distinctType.sort(function (a, b) { return (a[1] - b[1]); });

    let index = distinctType.findIndex(s => s[0] == story.type);

    let animationTimeout = story.duration * index / 5;
    return animationTimeout;
  }
  //#endregion

  return StoryPlayer;
})();
