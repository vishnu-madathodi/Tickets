function setComboDropdownHeight(cmb) {
    try {
        const ids = cmb.split(";");
        ids.forEach(function (id) {
            var $comboBox = $("." + id + "-dropbtn");
            var $dropdown = $("#" + id + "-wrapper");
 
            if (!$dropdown.data('original-max-height')) {
                $dropdown.data('original-max-height', parseInt($dropdown.css('max-height')));
            }
 
            function updateDropdownHeight() {
                var originalMaxHeight = $dropdown.data('original-max-height');
                var windowHeight = $(window).height();
                var comboHeight = $comboBox.outerHeight();
                var targetMaxHeight = ((windowHeight - comboHeight) / 2);
 
                if (originalMaxHeight > targetMaxHeight) {
                    $dropdown.css('max-height', targetMaxHeight + 'px');
                } else {
                    if (parseInt($dropdown.css('max-height')) !== originalMaxHeight) {
                        $dropdown.css('max-height', originalMaxHeight + 'px');
                    }
                }
            }
            $(window).on('resize orientationchange', updateDropdownHeight);
            updateDropdownHeight();
        });
    } catch (error) {
        console.log("Error inside function setComboDropdownHeight", error);
    }
}

function setAriaLabel(id) {
    try {
        var comboBox = $("." + id + "-dropbtn");
        var baseLabel = comboBox.data("base-aria-label");
        var updatedLabel;

        if (!baseLabel) {
            baseLabel = comboBox.attr("aria-label") || "";
            comboBox.data("base-aria-label", baseLabel);
        }

        var selectedValue = comboBox.find("span").text().trim();
        if(selectedValue == "[Select]"){
            updatedLabel = baseLabel;
        }
        else{
            updatedLabel = baseLabel + ", value selected " + selectedValue;
        }
        comboBox.attr("aria-label", updatedLabel);
        comboBox.trigger("blur");
        comboBox.trigger("focus");
    } catch (error) {
        console.error(`Error in the function: setAriaLabel: ${error}`);
    }
}

