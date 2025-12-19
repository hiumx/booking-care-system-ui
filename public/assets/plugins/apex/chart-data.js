'use strict';

$(document).ready(function() {

	
// Revenue Chart

if ($('#revenue-chart').length > 0) {
    var sCol = {
        chart: {
            height: 220,
            type: 'bar',
            stacked: true,
            toolbar: {
              show: false,
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%',
                endingShape: 'rounded'  
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 1,
        },
        series: [{
             name: 'High',
            color: '#0E82FD',
            data: [50,40,15,45,35,48,65]
        }],
        xaxis: {
            categories: ['M','T', 'W', 'T','F','S','S'],
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return "$ " + val + "k"
                }
            }
        }
    }
    
    var chart = new ApexCharts(
        document.querySelector("#revenue-chart"),
        sCol
    );
    
    chart.render();
}
	
// Appointment Chart

if ($('#appointment-chart').length > 0) {
  var sCol = {
      chart: {
          height: 220,
          type: 'bar',
          stacked: true,
          toolbar: {
            show: false,
          }
      },
      plotOptions: {
          bar: {
              horizontal: false,
              columnWidth: '50%',
              endingShape: 'rounded'  
          },
      },
      dataLabels: {
          enabled: false
      },
      stroke: {
          show: true,
          width: 1,
      },
      series: [{
           name: 'High',
          color: '#0E82FD',
          data: [40,20,30,60,90,40,110]
      }],
      xaxis: {
          categories: ['M','T', 'W', 'T','F','S','S'],
      },
      tooltip: {
          y: {
              formatter: function (val) {
                  return "$ " + val + "k"
              }
          },
      }
  }
  
  var chart = new ApexCharts(
      document.querySelector("#appointment-chart"),
      sCol
  );
  
  chart.render();
}

 	
// Heart Rate Chart
if ($('#heart-rate-chart').length > 0) {

var options = {
    series: [{
    data: [140,100,180,130,100,130]
  }],
    chart: {
    height: 306,
    type: 'bar',
    events: {
      click: function(chart, w, e) {
        // console.log(chart, w, e)
      }
    }
  },
  fill: {
    colors: ['#0E82FD']
},
  plotOptions: {
    bar: {
      columnWidth: '45%',
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  xaxis: {
    categories: [
      ['Mon'],
      ['Tue'],
      ['Wed'],,
      ['Thu'],
      ['Fri'],
      ['Sat'],
    ],
  },
  crosshairs: {
    show: false // <--- HERE
  }
  };

  var chart = new ApexCharts(document.querySelector("#heart-rate-chart"), options);
  chart.render();
}

// Bar Chart
if ($('#blood-pressure-chart').length > 0) {
var options = {
  series: [{
  data: [90, 60, 30, 60, 90, 70, 70]
}, {
  data: [110, 90, 40, 120, 130, 130, 130]
}],
  chart: {
  type: 'bar',
  height: 306
},
plotOptions: {
  bar: {
    horizontal: false,
    columnWidth: '55%',
    endingShape: 'rounded'
  },
},
dataLabels: {
  enabled: false
},
legend: {
  show: false
},
stroke: {
  show: true,
  width: 2,
  colors: ['transparent']
},
xaxis: {
  categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
},

fill: {
  opacity: 1,
  colors: ['#0E82FD'],
},
states: {
  hover: {
  color: '#00008B'
  }
}
};

var chart = new ApexCharts(document.querySelector("#blood-pressure-chart"), options);
chart.render();
}
  
});
