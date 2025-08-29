function DtPAddcls(ids) {
  try {
    var IDArray = ids.split(",").map((id) => id.trim());

    IDArray.forEach(function (eachId) {
      try {
        $("#" + eachId + "_date")
          .datepicker("option", "beforeShow", function (input, inst) {
            debugger;
            $("#ui-datepicker-div").addClass("dtp-cst-mtst");
          })
          .datepicker("option", "onClose", function (input, inst) {
            debugger;
            $("#ui-datepicker-div").removeClass("dtp-cst-mtst");
          });
      } catch (innerError) {
        console.error(
          "Error setting datepicker options for ID:",
          eachId,
          innerError
        );
      }
    });
  } catch (error) {
    console.error("Error initializing datepickers:", error);
  }
}
