/** Class RankingBar */
var RankingBar = (function () {

  /** Constructor */
  function RankingBar(selector, storyPlayerSelector, timeSeriesData, sidebarData, options = { enableSimpleBar: true }) {
    var self = this;
    this.$container = $(selector);
    this.$container.addClass("sidebar").data("sidebar", this);
    this.storyPlayer = $(storyPlayerSelector).data("story-player");
    this.timeSeriesData = timeSeriesData;
    this.sidebarData = sidebarData;
    this.searchWord = "";
    this.speed = PLAY_TIME.X1 * 2/4;

    // Generate Countries
    let html = '<div class="ranking-container">';
    for (let country in this.timeSeriesData) {
      let station = STATION_DATA.find(function (obj) { return obj.name === country });
      let flag = FLAGS_URL.replace('{countryCode}', station.country_code);
      let style = ''
    if(flag.includes('winterolympics2022')) style = 'background-size: contain;'
      html += '<div class="country-item" data-country="' + country + '" style="opacity: 0">' +
                '<div class="country-item-detail">' +
                  '<div class="index numberFont">0</div>' +
                  '<div class="flag" style="--url: url(' + flag + ');'+style+'"></div>' +
                  '<div class="content">' +
                    '<div class="country-name">' + country + '</div>' +
                  '</div>' +
                  '<div class="amount numberFont">0</div>' +
                '</div>' +
                '<div class="progress">' +
                  '<div class="progress-bar widthActive"></div>' +
                  '<div class="progress-bar widthRecoved"></div>' +
                  '<div class="progress-bar widthDeath"></div>' +
                '</div>' +
              '</div>';
    }
    html += '</div>';
    this.$container.html(html);

    // Enable custom Scrollbar
    if (options.enableSimpleBar == true)
      this.sidebar = new SimpleBar(this.$container[0]);

    // Enable Shufflejs
    this.shuffle = new Shuffle(this.$container.find('.ranking-container'), {
      itemSelector: '.country-item',
      speed: this.speed
    });

    // Listen TimePlayer 'speedchange' event
    this.storyPlayer.player.on("speedchange", function (transitionData) {
      self.updateTransitionTime(transitionData.transitionTime);
    });
  }

  /** Update RankingBar by timeIndex & re-sorting */
  RankingBar.prototype.update = function (timeIndex) {
    var self = this;
    this.$container.find('.country-item').each(function () {
      let country = $(this).data('country');
      let countryData = self.sidebarData[timeIndex][country];

      // Not show then no need further render for performance issue
      let isShow = (countryData.confirmed > 0);
      if (!isShow){
        $(this).attr('data-show', false);
        return;
      }
        
    
      $(this).attr("data-rank", countryData.rank);
      $(this).attr('data-show', isShow);
      $(this).find('.index').text(countryData.rank);
      $(this).find('.amount').text(NumberUtility.formatNumber(countryData.confirmed));
      $(this).find('.progress').css('width', countryData.confirmedPercent + '%');
      $(this).find('.widthActive').attr('title', NumberUtility.formatNumber(countryData.active));
      $(this).find('.widthActive').css('width', countryData.active / countryData.confirmed * 100 + '%');
      $(this).find('.widthRecoved').attr('title', NumberUtility.formatNumber(countryData.recovered));
      $(this).find('.widthRecoved').css('width', countryData.recovered / countryData.confirmed * 100 + '%');
      $(this).find('.widthDeath').attr('title', NumberUtility.formatNumber(countryData.deaths));
      $(this).find('.widthDeath').css('width', countryData.deaths / countryData.confirmed * 100 + '%');
    });
    this.shuffle.filter(RankingBar.filterByShow.bind(this), { by: RankingBar.sortByRank });
  }

  /** Search by country name */
  RankingBar.prototype.search = function (searchWord) {
    this.searchWord = searchWord;
    this.shuffle.filter(RankingBar.filterByShow.bind(this), { by: RankingBar.sortByRank });
  }

  /** Update transition time */
  RankingBar.prototype.updateTransitionTime = function (transitionTime) {
    this.speed = transitionTime * 2/4
    this.$container.find('.country-item').css({ 'transition-duration': this.speed + 'ms' });
    this.$container.find('.country-item .progress').css({ 'transition-duration': this.speed + 'ms' });
    this.$container.find('.country-item .progress .progress-bar').css({ 'transition-duration': this.speed + 'ms' });
  }

  /** Shuffle sort by rank */
  RankingBar.sortByRank = function (element) {
    return parseInt(element.getAttribute('data-rank'));
  }

  /** Shuffle filter by infected & searchWord */
  RankingBar.filterByShow = function (element) {
    var isShow = element.getAttribute('data-show') == 'true';
    var isContainsSearchWord = ($(element).find('.country-name').text().toLowerCase().indexOf(this.searchWord.toLowerCase()) !== -1)
    return isShow && isContainsSearchWord;
  }

  return RankingBar;
})();