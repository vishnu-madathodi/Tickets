$(document).ready(function () {
  const formFields = $(".form-field").find("input, select, textarea, button");

  formFields.on("keypress", function (e) {
    if (e.which === 13) {
      e.preventDefault();

      const currentIndex = formFields.index(this);
      const nextField = formFields.eq(currentIndex + 1);

      if (nextField.length) {
        nextField.focus();
      } else {
        $(this).blur();
      }
    }
  });
});
