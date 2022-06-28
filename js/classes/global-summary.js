/** Class GlobalSummary */
var GlobalSummary = (function () {

    /** Constructor */
    function GlobalSummary(selector, globalData, dateArray) {
        // UUID for unique CountUp elements Id
        this.uuid = StringUtility.uuidv4();

        this.$container = $(selector);
        this.$container.addClass("global-summary").data("global-summary", this);
        this.$container.html(this.getTemplate());
        this.globalData = globalData;
        this.dateArray = dateArray;

        // Init background Chart
        let dateAxes = DateUtility.getAxesDates(this.dateArray);
        let totalConfirmedChart = this.$container.find('.total-confirmed-chart')[0].getContext('2d');
        let totalActiveChart = this.$container.find('.total-active-chart')[0].getContext('2d');
        let totalRecoveredChart = this.$container.find('.total-recovered-chart')[0].getContext('2d');
        let totalDeathsChart = this.$container.find('.total-deaths-chart')[0].getContext('2d');
        this.chartConfirmed = GlobalSummary.initChart(totalConfirmedChart, dateAxes, 'Confirmed', 'rgb(255, 65, 108)', 'rgba(255, 65, 108, 0.2)', this.globalData.map(obj => obj.confirmed));
        this.chartActive = GlobalSummary.initChart(totalActiveChart, dateAxes, 'Active', 'rgb(40, 110, 255)', 'rgba(40, 110, 255, 0.2)', this.globalData.map(obj => obj.active));
        this.chartRecovered = GlobalSummary.initChart(totalRecoveredChart, dateAxes, 'Recovered', 'rgb(97, 206, 129)', 'rgba(97, 206, 129, 0.2)', this.globalData.map(obj => obj.recovered));
        this.chartDeaths = GlobalSummary.initChart(totalDeathsChart, dateAxes, 'Deaths', 'rgb(134, 67, 230)', 'rgba(134, 67, 230, 0.2)', this.globalData.map(obj => obj.deaths));

        // Init CountUp elements
        this.countUpConfirmed = new CountUp(this.uuid + '-total-confirmed', 0, { duration: 0.5 });
        this.countUpActive = new CountUp(this.uuid + '-total-active', 0, { duration: 0.5 });
        this.countUpRecovered = new CountUp(this.uuid + '-total-recovered', 0, { duration: 0.5 });
        this.countUpDeaths = new CountUp(this.uuid + '-total-deaths', 0, { duration: 0.5 });
    }

    /** Update global summary by timeIndex */
    GlobalSummary.prototype.update = function (timeIndex) {
        this.countUpConfirmed.update(this.globalData[timeIndex].confirmed);
        this.countUpActive.update(this.globalData[timeIndex].active);
        this.countUpRecovered.update(this.globalData[timeIndex].recovered);
        this.countUpDeaths.update(this.globalData[timeIndex].deaths);
    };

    /** Generate GlobalSummary inner HTML with UUID */
    GlobalSummary.prototype.getTemplate = function () {
        return `<!-- Confirmed -->
        <div class="global-summary-item confirmed">
          <div class="chart">
            <canvas class="total-confirmed-chart" width="200" height="80"></canvas>
          </div>
          <div class="content">
            <span class="icon"></span>
            <span id="` + this.uuid + `-total-confirmed" class="numberFont"></span>
          </div>
        </div>
        <!-- Active -->
        <div class="global-summary-item active">
          <div class="chart">
            <canvas class="total-active-chart" width="200" height="80"></canvas>
          </div>
          <div class="content">
            <span class="icon"></span>
            <span id="` + this.uuid + `-total-active" class="numberFont"></span>
          </div>
        </div>
        <!-- Recovered -->
        <div class="global-summary-item recovered">
          <div class="chart">
            <canvas class="total-recovered-chart" width="200" height="80"></canvas>
          </div>
          <div class="content">
            <span class="icon"></span>
            <span id="` + this.uuid + `-total-recovered" class="numberFont"></span>
          </div>
        </div>
        <!-- Deaths -->
        <div class="global-summary-item deaths">
          <div class="chart">
            <canvas class="total-deaths-chart" width="200" height="80"></canvas>
          </div>
          <div class="content">
            <span class="icon"></span>
            <span id="` + this.uuid + `-total-deaths" class="numberFont"></span>
          </div>
        </div>`;
    }

    /** Init ChartJS with config */
    GlobalSummary.initChart = function (context, date, label, color, background, data) {
        return new Chart(context, {
            type: 'line',
            data: {
                labels: date,
                datasets: [{
                    label: label,
                    backgroundColor: background,
                    borderColor: color,
                    pointHoverRadius: 0,
                    pointRadius: 0,
                    data: data
                }]
            },
            options: {
                maintainAspectRatio: false,
                tooltips: { enabled: false },
                legend: { display: false },
                scales: {
                    xAxes: [{ display: false }],
                    yAxes: [{ display: false }]
                }
            }
        });
    }

    return GlobalSummary;
})();

