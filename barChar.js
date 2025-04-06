function fillChart(ctrlChangedValue) {
    try {
        ctrlChangedValue.options.plugins.title.display = false;
        ctrlChangedValue.options.plugins.legend.display = false;
        ctrlChangedValue.options.scales.x.title.display = false;
        ctrlChangedValue.options.scales.y.title.display = false;

        ctrlChangedValue.options.scales.x.min = 0;
        ctrlChangedValue.options.scales.x.max = 7;

        // Custom tooltip format
        ctrlChangedValue.options.plugins.tooltip = {
            callbacks: {
                label: function(tooltipItem) {
                    return '$' + tooltipItem.raw.toFixed(2);
                }
            }
        };
    } 
    catch (error) {
        console.log('Error in [FillChartV2]', error);
    }
}