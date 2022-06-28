/** Class Repository */
var Repository = (function () {
  Repository.timeSeriesUrl = "https://pomber.github.io/covid19/timeseries.json";

  /** Constructor */
  function Repository() {}

  /** Fetch Data */
  Repository.fetchData = function (callback) {
    // Call to github data source
    $.ajax({
      url: Repository.timeSeriesUrl,
      cache: false,
      success: function (data) {
        let tsData = Repository.convertData(data);
        let retData = Repository.calculateData(tsData);
        callback(retData);
      },
    });
  };

  /** Calculate Data */
  Repository.calculateData = function (tsData) {
    // Calculate dateArray
    let firstCountry = tsData[Object.keys(tsData)[0]];
    let dateArray = firstCountry.map(function (obj) {
      return obj.date;
    });

    let globalData = [];
    let valueMinMax = { confirmed: [Infinity, -Infinity], active: [Infinity, -Infinity], recovered: [Infinity, -Infinity], deaths: [Infinity, -Infinity] };
    let sidebarData = [];
    dateArray.forEach(function (date, dateIndex) {
      globalData.push({ date: date, confirmed: 0, active: 0, recovered: 0, deaths: 0, dailyConfirmed: 0, dailyActive: 0, dailyRecovered: 0, dailyDeaths: 0 });
      let confirmedArray = [];
      for (let country in tsData) {
        confirmedArray.push({ country: country, confirmed: tsData[country][dateIndex].confirmed });
      }
      confirmedArray.sort(function (a, b) {
        return b.confirmed - a.confirmed;
      });

      let maxConfirmed = confirmedArray[0].confirmed;
      let sidebarMoment = {};
      for (let country in tsData) {
        sidebarMoment[country] = {
          rank: confirmedArray.findIndex(function (obj) {
              return obj.country == country;
            }) + 1,
          confirmed: tsData[country][dateIndex].confirmed,
          active: tsData[country][dateIndex].active,
          recovered: tsData[country][dateIndex].recovered,
          deaths: tsData[country][dateIndex].deaths,
          confirmedPercent:
            (tsData[country][dateIndex].confirmed / maxConfirmed) * 100,
        };
      }
      sidebarData.push(sidebarMoment);
    });

    for (let countryName in tsData) {
      tsData[countryName].forEach(function (value, index) {
        globalData[index].confirmed += value.confirmed;
        globalData[index].active += value.active;
        globalData[index].recovered += value.recovered;
        globalData[index].deaths += value.deaths;
        globalData[index].dailyConfirmed += value.dailyConfirmed;
        globalData[index].dailyActive += value.dailyActive;
        globalData[index].dailyRecovered += value.dailyRecovered;
        globalData[index].dailyDeaths += value.dailyDeaths;
      });
    }

    for (let countryName in tsData) {
      tsData[countryName].forEach(function (value, index) {
        if (value.confirmed < valueMinMax.confirmed[0]) valueMinMax.confirmed[0] = value.confirmed
        if (value.confirmed > valueMinMax.confirmed[1]) valueMinMax.confirmed[1] = value.confirmed

        if (value.active < valueMinMax.active[0]) valueMinMax.active[0] = value.active
        if (value.active > valueMinMax.active[1]) valueMinMax.active[1] = value.active

        if (value.recovered < valueMinMax.recovered[0]) valueMinMax.recovered[0] = value.recovered
        if (value.recovered > valueMinMax.recovered[1]) valueMinMax.recovered[1] = value.recovered

        if (value.deaths < valueMinMax.deaths[0]) valueMinMax.deaths[0] = value.deaths
        if (value.deaths > valueMinMax.deaths[1]) valueMinMax.deaths[1] = value.deaths
      });
    }

    let retData = {
      date: new Date(),
      timeSeriesData: tsData,
      dateArray: dateArray,
      valueMinMax: valueMinMax,
      globalData: globalData,
      sidebarData: sidebarData,
    };

    return retData;
  };

  /** Convert Data */
  Repository.convertData = function (data) {
    // Filter station, precalculate daily data, format date
    let retData = {};
    for (let countryName in data) {
      let station = STATION_DATA.find(function (obj) {
        return obj.name === countryName;
      });
      if (!station) {
        console.log("Cannot find coordinates of " + countryName);
        continue;
      }

      let countryData = data[countryName].map(function (item, index, arr) {
        let pre = arr[index - 1];
        return {
          date: DateUtility.formatDate(item.date),
          confirmed: item.confirmed,
          active: item.confirmed - item.recovered - item.deaths,
          recovered: item.recovered,
          deaths: item.deaths,
          dailyConfirmed: item.confirmed - (pre ? pre.confirmed : 0),
          dailyActive:
            item.confirmed -
            item.recovered -
            item.deaths -
            (pre ? pre.confirmed - pre.recovered - pre.deaths : 0),
          dailyRecovered: item.recovered - (pre ? pre.recovered : 0),
          dailyDeaths: item.deaths - (pre ? pre.deaths : 0),
        };
      });
      retData[countryName] = countryData;
    }
    return retData;
  };

  return Repository;
})();
