function triggerOnRowClick(ctrlid, txtBox) {
    try {
        debugger;
        if ($('#' + txtBox).val()) $('#' + txtBox).val('').trigger('change');
        var table = document.getElementById(ctrlid + '_fixedTable');
        var rows = table.querySelectorAll('tr:not(.expand-child)');
        rows.forEach(row => {
            row.addEventListener('click', function () {
                var nextRow = row.nextElementSibling;
                if (nextRow && nextRow.classList.contains('expand-child')) {
                    var expanded = window.getComputedStyle(nextRow).display === 'table-row';
                    $('#' + txtBox).val(expanded ? 'expanded' : 'collapsed').trigger('change');
                }
            });
        });
    } catch (error) {
        console.error('Error in triggerOnRowClickA:', error);
    }
}