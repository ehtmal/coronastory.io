var Utility = (function () {
  function Utility() { }

  Utility.objectifyForm = function (formArray) {
    var obj = {};
    for (var i = 0; i < formArray.length; i++) {
      obj[formArray[i]['name']] = formArray[i]['value'];
    }
    return obj;
  };

  Utility.debounce = function (fn, threshold) {
    var timeout;
    threshold = threshold || 100;
    return function debounced() {
      clearTimeout(timeout);
      var args = arguments;
      var _this = this;
      function delayed() {
        fn.apply(_this, args);
      }
      timeout = setTimeout(delayed, threshold);
    };
  };

  return Utility;
})();
