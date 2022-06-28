var StringUtility = (function () {
  function StringUtility() { }

  StringUtility.replaceAll = function (str, find, replace) {
    var holder = find.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
    return str.replace(new RegExp(holder, 'g'), replace);
  };

  StringUtility.uuidv4 = function () {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, function(c) {
        return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      }
    );
  };

  return StringUtility;
})();
