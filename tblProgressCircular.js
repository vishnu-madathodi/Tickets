function setProgress(ctrlid) {
  try {
    setTimeout(() => {
      let $progressItems = $(`#${ctrlid} .circular-progress`);
      $progressItems.each(function () {
        let $progressItem = $(this);
        let $stepItem = $progressItem.siblings(".step_label");
        let progressCount = $stepItem.data("current-step");

        $progressItem.css(
          "background",
          `conic-gradient(#7b61ff calc(${progressCount * 20}%), #e6e6f0 0)`
        );
      });
    }, 0);
  } catch (error) {
    console.error(`Error in setProgress: ${error}`);
  }
}
