function fillChartStacked(ctrlChangedValue) {
    try {
        // Configure x-axis settings
        ctrlChangedValue.options.scales.x = {
            grid: { display: false },
            ticks: { beginAtZero: true },
            stacked: true // Enable stacking on x-axis
        };

        // Configure plugins
        ctrlChangedValue.options.plugins.legend = { display: false };
        ctrlChangedValue.options.plugins.title = { display: false };

        // Maintain aspect ratio settings
        ctrlChangedValue.options.maintainAspectRatio = false;

        // Disable axis labels
        ctrlChangedValue.options.scales.x.title = { display: false };
        ctrlChangedValue.options.scales.y.title = { display: false };
    } catch (error) {
        console.error('Error in [fillChartStacked]:', error);
    }
}
