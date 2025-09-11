//cePreventEmoji
function preventEmojiusername(id) {
  try {
    var inputField = document.getElementById(id);

    let debounceTimer;
    function filterInput() {
      var inputValue = inputField.value;
      // Allow only alphanumeric characters and specific special characters (@, ., _, -)
      var filteredValue = inputValue.replace(/[^a-zA-Z0-9@._\-]/g, "");
      if (filteredValue !== inputValue) {
        inputField.value = filteredValue;
      }
    }

    inputField.addEventListener("input", function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(filterInput, 0);
    });

    inputField.addEventListener("paste", function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(filterInput, 0);
    });
  } catch (error) {
    console.log("error in [preventEmojiusername]", error);
  }
}

//password
function preventEmojipassword(id) {
  try {
    var inputField = document.getElementById(id);

    let debounceTimer;

    function filterInput() {
      var inputValue = inputField.value;
      // Only allow letters, numbers, and the specified special characters
      var filteredValue = inputValue.replace(/[^a-zA-Z0-9!@#$%^&*]/g, "");

      if (filteredValue !== inputValue) {
        inputField.value = filteredValue;
      }
    }

    // Debounce input event to avoid excessive function calls
    inputField.addEventListener("input", function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(filterInput, 0);
    });

    // Handle pasted input to prevent emojis
    inputField.addEventListener("paste", function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(filterInput, 0);
    });
  } catch (error) {
    console.log("error in [preventEmojipassword]", error);
  }
}

//password verification with string of ids passed
function preventEmojipassword(idString) {
  try {
    // Split the comma-separated ID string into an array of IDs
    const ids = idString.split(",");

    // Iterate over each ID to apply the character filtering
    ids.forEach((id) => {
      const inputId = id.trim();
      const $inputField = $(`#${inputId}`);

      if ($inputField.length) {
        let debounceTimer;

        // The function to filter the input value
        function filterInput() {
          const inputValue = $inputField.val();
          // Only allow letters, numbers, and the specified special characters
          const filteredValue = inputValue.replace(/[^a-zA-Z0-9!@#$%^&*]/g, "");

          // If the value was changed, update the input field
          if (filteredValue !== inputValue) {
            $inputField.val(filteredValue);
          }
        }

        // Add event listeners with unique namespaces by adding the ID
        $inputField.on(`input.${inputId}`, function () {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(filterInput, 0);
        });

        $inputField.on(`paste.${inputId}`, function () {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(filterInput, 0);
        });
      } else {
        console.warn(`Element with ID "${inputId}" not found.`);
      }
    });
  } catch (error) {
    console.log("error in [preventEmojipassword]", error);
  }
}

function setNumberPad(ctrlIds) {
  const ids = ctrlIds.split(",");
  ids.forEach((id) => {
    const trimmedId = id.trim();
    const $element = $("#" + trimmedId);

    if ($element.length) {
      $element.attr("inputmode", "numeric");
      $element.on("input", function () {
        this.value = this.value.replace(/[^0-9]/g, "");
      });
    }
  });
}
