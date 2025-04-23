function resetNextTDs() {
    setTimeout(() => {
        debugger;
        $("td.enableSelect").each(function () {
            let nextTd = $(this).next("td");
            nextTd.css("display", "none"); // Show them back (reset any hidden ones)
        });
    }, 10);
}

function SearchRowSelectClicked(element) {

    $('input.EnblSlct').attr("type", "radio");

    $('input.EnblSlct').attr("type", "radio").each(function () {
        $(this).prop('checked', false).val("off");
    });

    $(element).prop('checked', true).val("on");

    let parentTd = $(element).closest("td.enableSelect");
    let nextTd = parentTd.next("td");

    let storedId = nextTd.text().trim();

    $(".txt-trigger").val(storedId).trigger("change");
}
