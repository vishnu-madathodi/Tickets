function setTriggerForFooterClick() {
  try {
    if ($(".txt-trigger-dialog").length > 0) {
      $(".main-footer a.db-trigger-dialog").on("click", function (e) {
        e.preventDefault();
        var $span = $(this).find("span.anchor-text");
        var linkText = $span.length > 0 ? $span.text().trim() : $(this).text().trim();
        $(".txt-trigger-dialog").val(linkText).trigger("change");
      });
    }
  } catch (exception) {
    console.error(
      `Error found in fucntion: setTriggerForFooterClick; ${exception}`
    );
  }
}