var NumberUtility = (function () {
  function NumberUtility() { }

  NumberUtility.formatNumber = function (number) {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  NumberUtility.shorter = function (num) {
    var si = [
      { value: 1, symbol: "" },
      { value: 1E3, symbol: "k" },
      { value: 1E6, symbol: "M" },
      { value: 1E9, symbol: "G" },
      { value: 1E12, symbol: "T" },
      { value: 1E15, symbol: "P" },
      { value: 1E18, symbol: "E" }
    ];
    var si_negative = [
      { value: 0, symbol: "" },
      { value: -1E3, symbol: "k" },
      { value: -1E6, symbol: "M" },
      { value: -1E9, symbol: "G" },
      { value: -1E12, symbol: "T" },
      { value: -1E15, symbol: "P" },
      { value: -1E18, symbol: "E" }
    ]
    var rx = /\.0+$|^-?(\.[0-9]*[1-9])0+$/;
    var i;
    if (num >= 0) {
      for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
          break;
        }
      }
    } else {
      for (i = si_negative.length - 1; i > 0; i--) {
        if (num <= si_negative[i].value) {
          break;
        }
      }
    }
    return (num / si[i].value).toFixed(1).replace(rx, "$1") + si[i].symbol;
  };

  return NumberUtility;
})();
