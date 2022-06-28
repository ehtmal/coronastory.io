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
  
  /** Get day have pass when have first confirmed case */
  DateUtility.getJoiningDates = function (timeSeriesData, country, dateArray) {
    if (country === 'GLOBAL')
      return dateArray;
    
    var arr = timeSeriesData[country].map(function (obj) { return obj.date; });
    var index = timeSeriesData[country].findIndex(function (obj) { return obj.confirmed !== 0; });
    return arr.slice(index);
  };
  
  return DateUtility;
})();
