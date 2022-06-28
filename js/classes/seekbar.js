/** Class SeekBar */
var SeekBar = (function () {

    var DEFAULT_OPTIONS = {
        min: 0, 
        max: 100, 
        first_case_position: 1, 
        first_death_position: 1, 
        intervals: 100,
        manualStories: [],
        autoStories: []
    }

    /** Constructor */
    function SeekBar(selector, options = {}) {
        var self = this;
        self.$container = $(selector);
        self.$container.addClass("sk-seek-bar").data("seekbar", this);
        let html = '<div class="seekbar-player"><div class="player-control-button play-button"></div></div><input type="range" value="0" max="' + options.max + '" step="1"><progress value="0" max="' + options.max + '"></progress>';
        self.$container.html(html);
        self.min = options.min ? options.min : DEFAULT_OPTIONS.min;
        self.max = options.max ? options.max : DEFAULT_OPTIONS.max;
        self.firstCasePosition = options.first_case_position ? options.first_case_position : DEFAULT_OPTIONS.first_case_position;
        self.firstDeathPosition = options.first_death_position ? options.first_death_position : DEFAULT_OPTIONS.first_death_position;
        self.intervals = options.intervals ? options.intervals : DEFAULT_OPTIONS.intervals;
        self.manualStories = options.manualStories ? options.manualStories : DEFAULT_OPTIONS.manualStories;
        self.autoStories = options.autoStories ? options.autoStories : DEFAULT_OPTIONS.autoStories;
        self.bindingEvents();
    }

    /** Calculate marker position  */
    SeekBar.prototype.renderMarkers = function() {
        var self = this;
        self.countMarker = {};
        for (let index = 0; index <= self.max; index++) {
            self.countMarker[index] = 0;
        }
        self.renderManuals();
        self.renderAutos();
    }

    /** Calculate manual story marker position  */
    SeekBar.prototype.renderManuals = function() {
        var self = this;
        self.$container.find('.manual-story-marker').remove();
        self.manualStories.forEach(function(story) {
            self.countMarker[story.pos] += 1;
            var count = self.countMarker[story.pos];
            let markerHtml = '<div class="manual-story-marker marker" data-toggle="tooltip" title="' + (story.title != '' ? story.title : story.description) + '" data-html="true" data-pos="' + story.pos + '"><div class="v-circle"></div><div class="v-line"></div></div>';
            var $markerHtml = $(markerHtml);
            $markerHtml.css('left', self.getLeftOfMarker(story.pos) + "px").css('top', (-15 * count) + "px").appendTo(self.$container); 
            $markerHtml.find('.v-line').css('height', (15 * count - 2) + "px");
            $markerHtml.hover(function() {
                $(this).find('.v-line').css('height', (15 * count - 7) + "px");
            }, function() {
                $(this).find('.v-line').css('height', (15 * count - 2) + "px");
            });
        });
        $('[data-toggle="tooltip"]').tooltip();
    }

    /** Calculate auto story marker position  */
    SeekBar.prototype.renderAutos = function() {
        var self = this;
        self.$container.find('.auto-story-marker').remove();
        self.autoStories.forEach(function(story) {
            self.countMarker[story.pos] += 1;
            var count = self.countMarker[story.pos];
            let markerHtml = '<div class="auto-story-marker marker" data-html="true" data-toggle="tooltip" data-pos="' + story.pos + '"><div class="v-circle"></div><div class="v-line"></div></div>';
            var $markerHtml = $(markerHtml);
            $markerHtml.attr('title', story.title != '' ? story.title : story.description).addClass(story.type)
            .css('left', self.getLeftOfMarker(story.pos) + "px")
            .css('top', -15 * count)
            .appendTo(self.$container);
            $markerHtml.find('.v-line').css('height', (15 * count - 2) + "px");
            $markerHtml.hover(function() {
                $(this).find('.v-line').css('height', (15 * count - 7) + "px");
            }, function() {
                $(this).find('.v-line').css('height', (15 * count - 2) + "px");
            });
        });
        $('[data-toggle="tooltip"]').tooltip();
    }
  
    /** Set position of seek bar  */
    SeekBar.prototype.setPosition = function(value) {
        this.$container.find('input').val(value);
        this.$container.find('progress').val(value);
    }

    /** Change position of seek bar  */
    SeekBar.prototype.changePosition = function(value) {
        this.$container.find('input').val(value).trigger("change");
        this.$container.find('progress').val(value);
    }

    /** Get position of seek bar  */
    SeekBar.prototype.getPosition = function() {
        return this.$container.find('progress').val();
    }

    /** Binding events for HTML */
    SeekBar.prototype.bindingEvents = function () {
        var self = this;
        // Change input range value
        self.$container.on('change', 'input', function(e) {
            var value = e.target.value;
            self.$container.find('progress').val(value);
            var $marker = self.$container.find('.marker[data-pos="' + value + '"]');
            $marker.tooltip('show');
            setTimeout(function () {
                $marker.tooltip('hide');
            }, 1500)
        });
        // Play/pause button click
        self.$container.on('click', '.play-button', function(e) {
            if($(this).hasClass('paused')) {
                $(this).removeClass('paused');
                clearInterval(self.playingProcess);
            } else {
                $(this).addClass('paused');
                self.playingProcess = setInterval(function() {
                    if (self.getPosition() < self.max) {
                        self.changePosition(self.getPosition() + 1);
                    } else {
                        self.$container.find('.play-button').removeClass('paused');
                        clearInterval(self.playingProcess);
                    }
                }, self.intervals);
            }
        });
        // Manual story marker click
        self.$container.on('click', '.manual-story-marker', function(e) {
            var pos = $(this).data('pos');
            self.changePosition(pos);
        });
        // Auto story marker click
        self.$container.on('click', '.auto-story-marker', function(e) {
            var pos = $(this).data('pos');
            self.changePosition(pos);
        });
    }

    SeekBar.prototype.getLeftOfMarker = function (val) {
        var self = this;
        var half_thumb_width = 17;
        var half_label_width = 5;
        var width = self.$container.find('input').width();
        var center_position = width / 2;
        var percent_of_range = val / (self.max - self.min);
        if (isNaN(percent_of_range)) {
            percent_of_range = 0;
        }
        var value_px_position = percent_of_range * width;
        var dist_from_center = value_px_position - center_position;
        var percent_dist_from_center = dist_from_center / center_position;
        var offset = percent_dist_from_center * half_thumb_width;
        var left = value_px_position - half_label_width - offset + 45;
        return left;
    }
  
    return SeekBar;
  })();