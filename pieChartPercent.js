var ChartObject = [];

function SetCustomCheckBoxLegendsForPieChart(chart, chartName) {
    try {
        // Hide the default legend in Chart.js v3.x
        chart.options.plugins.legend.display = false;
        
        // Store chart instance globally
        ChartObject[chartName] = chart;

    } catch (error) {
        console.log('Error in SetCustomCheckBoxLegendsForPieChart', error);
    }
}

// Generate a separate custom legend outside the chart
function GenerateCustomLegend(chart, chartName) {
    var legendContainer = document.getElementById(`custom-chart-legend-controller-${chartName}`);
    if (!legendContainer) return;

    legendContainer.innerHTML = ""; // Clear existing legend

    chart.data.labels.forEach((label, i) => {
        var color = chart.data.datasets[0].backgroundColor[i];

        var legendItem = document.createElement("div");
        legendItem.className = "legend-item";
        legendItem.innerHTML = `
            <input type="checkbox" id="legend-${chartName}-${i}" checked 
            onchange="updateDataset(event, ${i}, '${chartName}')">
            <span style="background:${color}; width:12px; height:12px; display:inline-block; margin-right:5px;"></span>
            ${label} (${chart.data.datasets[0].data[i]})
        `;
        legendContainer.appendChild(legendItem);
    });
}

// Function to toggle dataset visibility
var updateDataset = function (e, datasetIndex, chartName) {
    var chart = ChartObject[chartName];
    chart.toggleDataVisibility(datasetIndex);
    chart.update();
};

function OverrideChart(ctrlID) {
    try {
        FillChartV2 = function (ctrlid, ctrlChangedValue) {
            
            if (ctrlID === ctrlid) {
                ctrlChangedValue.type = "doughnut";
                const allowedPercentageTitles = ["Percentage", "Percentage2"];
                const allowedTotalTitles = ["Total", "Total2"];
                const chartTitle = ctrlChangedValue.options.plugins.title.text;

                if (allowedPercentageTitles.includes(chartTitle)) {
                    var Percentagedata = document.querySelector("[name=txtPercentage]").value.split(";");
                    var lbl = [], data = [];

                    Percentagedata.forEach(item => {
                        var parts = item.split(":");
                        lbl.push(parts[0]);
                        data.push(parts[1]);
                    });

                    ctrlChangedValue.data.datasets[0].data = data;
                    ctrlChangedValue.data.labels = lbl;
                }

                if (allowedTotalTitles.includes(chartTitle)) {
                    var Totaldata = document.querySelector("[name=txtTotal]").value.split(";");
                    var lbl = [], data = [];

                    Totaldata.forEach(item => {
                        var parts = item.split(":");
                        lbl.push(parts[0]);
                        data.push(parts[1]);
                    });

                    ctrlChangedValue.data.datasets[0].data = data;
                    ctrlChangedValue.data.labels = lbl;
                }

                // Register a custom plugin for the "Total" chart
                const totalLabelPlugin = {
                    id: 'totalLabel',
                    beforeDraw: (chart) => {
                        if (allowedTotalTitles.includes(chartTitle)) {
                            const ctx = chart.ctx;
                            const width = chart.width;
                            const height = chart.height;

                            ctx.save();
                            ctx.font = "20px Arial";
                            ctx.textBaseline = "middle";

                            let sum = chart.data.datasets[0].data.reduce((a, b) => parseInt(a) + parseInt(b), 0);
                            const text = "Total";
                            const text2 = sum;

                            ctx.fillText(text, width / 2 - ctx.measureText(text).width / 2, height / 2 - 20);
                            ctx.fillText(text2, width / 2 - ctx.measureText(text2).width / 2, height / 2 + 10);
                            ctx.restore();
                        }
                    }
                };

                Chart.register(totalLabelPlugin);

                // Apply the legend fix
                SetCustomCheckBoxLegendsForPieChart(ctrlChangedValue, ctrlChangedValue.options.plugins.title.text);
            }

            // Remove previous chart
            $('#' + ctrlid + ' .chart-container').remove();
            $('#' + ctrlid).append(`<div class="chart-container" style="width:100%;"><canvas id="canvas-${ctrlid}"></canvas></div>`);

            var ctx = document.getElementById(`canvas-${ctrlid}`).getContext('2d');
            var chart = new Chart(ctx, ctrlChangedValue);

            // Generate the custom legend outside the chart
            GenerateCustomLegend(chart, ctrlChangedValue.options.plugins.title.text);

            //ChartObject["ChartName"] = chart;
            ChartObject[ctrlChangedValue.options.plugins.title.text] = chart;

            var canvas = document.getElementById(`canvas-${ctrlid}`);
            canvas.onclick = function (evt) {
                var activePoints = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, false);
                if (activePoints.length > 0) {
                    var chartData = activePoints[0].element.$context.raw;
                    var idx = activePoints[0].index;
                    var label = chart.data.labels[idx];
                    var value = chart.data.datasets[0].data[idx];

                    if (label && value) {
                        ValueChangeEvent(ctrlid, this.name, label + '§' + value);
                    }
                }
            };
        };
    } catch (error) {
        console.log('Error in [OverrideChart]', error);
    }
}