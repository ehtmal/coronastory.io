var DateUtility = (function () {
  function DateUtility() { }

  /** Format from String or Date to format: YYYY-MM-DD */
  DateUtility.formatDate = function (date) {
    var dayjsObj = dayjs(date);
    return dayjsObj.format("YYYY-MM-DD");
  };

  return DateUtility;
})();
