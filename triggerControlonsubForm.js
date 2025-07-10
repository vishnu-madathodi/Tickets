function manageSubFormVisibility(ctrlid, sf1, sf2, sf3, sf4) {
  let clickedInside = false;

  $(document).on("mousedown", function (e) {
    // Check if the clicked element is inside any of the elements with IDs ct1, ct2, ct3 or ct4
    clickedInside =
      $(e.target).closest(`#${sf1}, #${sf2}, #${sf3}, #${sf4}`).length > 0;
  });
  $(".cusCombo").on("focusout", function (e) {
    try {
      if (clickedInside) {
        return;
      } else {
        if ($("#" + ctrlid).length) {
          $("#" + ctrlid)
            .val("hide")
            .trigger("change");
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  });
}

//new implementation
function manageSubFormVisibilityNew(ctrlid, btnid) {
  const $cusCombo = $("#" + ctrlid);
  const $btn = $("#" + btnid);
  $cusCombo.hide();

  $btn.on("click", function () {
    if ($cusCombo.is(":visible")) {
      $cusCombo.slideUp(200);
    } else {
      $cusCombo.slideDown(200);
    }
  });

  $(document).on("click", function (e) {
    const $target = $(e.target);

    const isOutside =
      !$cusCombo.is($target) &&
      $cusCombo.has($target).length === 0 &&
      !$btn.is($target) &&
      $btn.has($target).length === 0;

    const isInnerButton = $cusCombo.has($target).length && $target.is("button");

    if (isOutside || isInnerButton) {
      $cusCombo.slideUp(200);
    }

    const isInnerInput =
      $cusCombo.has($target).length && $target.is('input[type="checkbox"]');
    if (isInnerInput) {
      requestAnimationFrame(() => {
        $cusCombo.slideUp(200);
      });
    }
  });
}
