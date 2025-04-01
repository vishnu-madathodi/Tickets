// Utility function: quickTransferDebounce (waits for the specified delay before executing the function)
function quickTransferDebounce(func, wait) {
    try {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    } catch (error) {
        console.log('error in [quickTransferDebounce]', error);
    }
}

// Function that you want to call after all changes are detected
function setLanidCmb(ctrlid) {
    try {
        var lanidMap = {
            "Deposits": "31902",
            "Loans": "31903",
            "Credit Cards": "31901",
            "Cross Account": "31904",
            "Cross Account Transfer": "31123"
        };

        $('#' + ctrlid).find('h4.dropdown-heading').each(function () {
            var headingText = $(this).text();
            var updatedText = headingText;
            var textToMatch;
            var colonIndex = headingText.indexOf(':');

            if (colonIndex !== -1) {
                // Get the text after the colon
                textToMatch = headingText.substring(colonIndex + 1).trim();
            } else {
                // If no colon, consider the entire heading text
                textToMatch = headingText.trim();
            }

            // Check if the textToMatch matches any of the keys in lanidMap
            for (var key in lanidMap) {
                if (textToMatch.toUpperCase() === key.toUpperCase()) {
                    // Replace the matched text with the same text wrapped in a span with lanid attribute
                    var regex = new RegExp('\\b' + key + '\\b', 'i');
                    updatedText = headingText.replace(regex, function (match) {
                        return '<span lanid="' + lanidMap[key] + '">' + match + '</span>';
                    });
                    break;
                }
            }

            // Update the heading element with the new HTML
            $(this).html(updatedText);
        });
    } catch (error) {
        console.log('error in [setLanidCmb]', error);
    }
}


function activateLanguageSwitchObserver(controlId) {
    try {
        const debouncedCallback = quickTransferDebounce(setLanidCmb, 300);  // 300ms delay

        // MutationObserver callback function
        const observerCallback = function (mutationsList, observer) {
            // When a mutation is detected, call the debounced function
            debouncedCallback(controlId);
            observer.disconnect();
            console.log('Disconnect from the setLanId');
        };

        // Set up MutationObserver to watch for changes in the observedElement
        const targetNode = document.getElementById(controlId);
        const config = { childList: true, subtree: true };
        const observer = new MutationObserver(observerCallback);

        // Start observing the target element for changes
        observer.observe(targetNode, config);
    } catch (error) {
        console.log('error in [activateLanguageSwitchObserver]', error);
    }
}

// Function that you want to call after all changes are detected
function manageComboBoxOptions(comboBoxFrom, comboBoxTo, option, combobox) {
    try {
        var comboBox1;
        var comboBox2;
        var selectedValue1;
        if (combobox == "from") {
            comboBox1 = $('.' + comboBoxFrom + '-dropdown-select');
            comboBox2 = $('.' + comboBoxTo + '-dropdown-select');
            selectedValue1 = comboBox1.find('.' + comboBoxFrom + '-dropbtn span').text();
        } else if (combobox == "to") {
            comboBox1 = $('.' + comboBoxTo + '-dropdown-select');
            comboBox2 = $('.' + comboBoxFrom + '-dropdown-select');
            selectedValue1 = comboBox1.find('.' + comboBoxTo + '-dropbtn span').text();
        }

        if (option == "enable") {
            try {
                comboBox2.find('.dropdown-item-container').each(function () {
                    const optionValue = $(this).find('.drop-down-item');
                    if (optionValue.hasClass('disableElement')) {
                        $(this).closest('li').css('pointer-events', 'auto')
                            .find('.drop-down-item')
                            .css('pointer-events', 'auto')
                            .removeClass('disableElement');
                    }
                });
            } catch (error) {
                console.log('An error occurred in enableComboBoxOptions', error);
            }
        } else if (option == "disable") {
            try {
                comboBox2.find('.dropdown-item-container .drop-down-item').css('pointer-events', 'auto').removeClass('disableElement');
                comboBox2.find('.dropdown-item-container').each(function () {
                    const optionValue = $(this).find('.drop-down-item h5').contents().filter(function () {
                        return this.nodeType == 3;
                    }).text().trim();
                    if (optionValue && optionValue === selectedValue1) {
                        $(this).closest('li').css('pointer-events', 'none')
                            .find('.drop-down-item')
                            .css('pointer-events', 'none')
                            .addClass('disableElement');
                    }
                });
            } catch (error) {
                console.log('An error occurred in disableComboBoxOptions', error);
            }
        }
    } catch (error) {
        console.log('error in [manageComboBoxOptions]', error);
    }
}

function activateComboBoxChangeObserver(comboBoxFrom, comboBoxTo, option, combobox) {
    try {
        const debouncedCallback = quickTransferDebounce(manageComboBoxOptions, 300);  // 300ms delay

        // MutationObserver callback function
        const observerCallback = function (mutationsList, observer) {
            // Call the debounced function on mutation detection
            debouncedCallback(comboBoxFrom, comboBoxTo, option, combobox);
            observer.disconnect();  // Disconnect observer after one change
            console.log('Disconnect from the mutationsList');
        };

        // Declare the targetNode before the if-else block
        let targetNode;

        if (combobox === "from") {
            // Watch for changes in the target comboBoxTo if combobox is "from"
            targetNode = document.getElementById(comboBoxTo);
        } else if (combobox === "to") {
            // Watch for changes in the target comboBoxFrom if combobox is "to"
            targetNode = document.getElementById(comboBoxFrom);
        }

        // Ensure that targetNode exists before observing
        if (targetNode) {
            const config = { childList: true, subtree: true };
            const observer = new MutationObserver(observerCallback);

            // Start observing the target element for changes
            observer.observe(targetNode, config);
        } else {
            console.error('Target node not found for comboBox:', combobox);
        }
    } catch (error) {
        console.log('Error in [activateComboBoxChangeObserver]:', error);
    }
}