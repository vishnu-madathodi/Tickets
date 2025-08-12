function triggerWrapUpDialog(ctrlid, className, namespace = "triggerWrapUpDialog") {
  try {
    $("#dialogBox").off(`click.${namespace}`, "#btn_custommsg_2");

    $("#dialogBox").on(`click.${namespace}`, "#btn_custommsg_2", function (e) {
      var $dialogContainer = $(this).closest("#cl-dialog-container");

      if ($dialogContainer.hasClass(className)) {
        setTimeout(function () {
          var randomValue = Math.floor(Math.random() * 10000);

          $("#" + ctrlid)
            .val(randomValue)
            .trigger("change");
        }, 0);
      }
    });
  } catch (exception) {
    console.error(`Error in triggerWrapUpDialog: ${exception}`);
  }
}