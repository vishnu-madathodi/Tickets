if (typeof RefreshCaptcha === "function") {
  function RefreshCaptcha(id, name, value) {
    try {
      //default scripts:
      var disabledCaptcha = "False";
      var ctrlText = document.getElementById(id + "_button");
      if (ctrlText) {
        disabledCaptcha = document
          .getElementById(id + "_button")
          .getAttribute("disabled");
      }
      if (!disabledCaptcha) {
        var ctrl = document.getElementById(id + "_image");
        if (ctrl) {
          $(ctrl).css({
            "background-image":
              'url("/AppSite/Pages/CaptchaHandler.ashx?id=' +
              id +
              "&cv=" +
              new Date().getTime() +
              '")',
          });
        }
      }

      //new changes
      const $txtTrigger = $('[data-trigger="true"]');
      $txtTrigger.val("triggered").trigger("change");
    } catch (error) {
      console.error(`Error in function: RefreshCaptcha: ${error}`);
    }
  }
}
