/** Class BypassDate */
var BypassDate = (function () {

  /** Constructor */
  function BypassDate(selector, dates = []) {
    this.$container = $(selector);
    this.$container.addClass("bypass-date").data("bypass-date", this);
    this.$container.html(BypassDate.getTemplate());
    this.dates = dates;
  }

  /** Update BypassDate time */
  BypassDate.prototype.updateTime = function(dates = []) {
    this.dates = dates;
  };

  /** Update BypassDate timeIndex */
  BypassDate.prototype.updateTimeIndex = function(timeIndex) {
    this.$container.find('.current-date').text(this.dates[timeIndex]);
    this.$container.find('.date-count .number').text(timeIndex + 1);
  };

  /** Generate Bypass Date inner HTML */
  BypassDate.getTemplate = function() {
    return `<div class="date-count">
              <div class="text numberFont" data-i18n="day">DAY</div>
              <div class="number numberFont">0</div>
            </div>
            <div class="current-date numberFont">YYYY-MM-DD</div>`
  }

  return BypassDate;
})();