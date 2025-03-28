let scrollPos;
function saveScroll(ctrlId) {
    $(document).ready(function () {
        let ctrl = $("#" + ctrlId);
        
        $(ctrl).on("click", function () {
            scrollPos = $("#wrapper").scrollTop();
        });
    });
}
function setScroll(){
    setTimeout(() => {
        $("#wrapper").scrollTop(scrollPos);
    }, 100)
}

 