var DateUtility = (function () {
  function DateUtility() { }

  /** Format from String or Date to format: YYYY-MM-DD */
  DateUtility.formatDate = function (date) {
    var dayjsObj = dayjs(date);
    return dayjsObj.format("YYYY-MM-DD");
  };

  /** Get date with format: M/D */
  DateUtility.getAxesDates = function (dateArray) {
    return dateArray.map(function (value) { return (+value.substring(8, 10)) + '/' + (+value.substring(5, 7)); });
  };
  
  return DateUtility;
})();
