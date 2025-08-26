
function attachInputSanitizers(ctrlIdStr, trgtCtrlId) {
  try {
    const ctrlIds = ctrlIdStr.split(",").map((id) => id.trim());
    const $trgt = $("#" + trgtCtrlId);

    ctrlIds.forEach(function (ctrlId) {
      const $input = $("#" + ctrlId);

      if (!$input.length) {
        console.warn("Control with ID '" + ctrlId + "' not found.");
        return;
      }

      const namespace = `.sanitizer_${ctrlId}`;

      $input.off("input" + namespace).off("paste" + namespace);

      $input.on("input" + namespace + " paste" + namespace, function () {
        const value = $(this).val();
        const forbiddenPattern = /[<>\/]|<script.*?>/gi;

        if (forbiddenPattern.test(value)) {
          $(this).val("");
          if ($trgt.length) {
            $trgt.val(Math.random()).trigger("change");
          }
        }
      });
    });
  } catch (e) {
    console.error(`Error in function attachInputSanitizers: ${e}`);
  }
}