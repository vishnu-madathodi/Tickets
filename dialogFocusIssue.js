function setDialogFocus() {
    try {
        const target = $('#dialogBox');

        const observer = new MutationObserver(() => {
            if (target.is(':visible')) {
                console.log('Modal became visible');
                $('#wrapper').attr({
                    'inert': 'true'
                })
                var button = $("#dialogBox #btn_custommsg_1");
                button.on('click', function(){
                    $('#wrapper').removeAttr('inert');
                });
            }
        });

        observer.observe(target[0], {
            attributes: true,
            attributeFilter: ['style', 'class'],
            subtree: false
        });
    } catch (error) {
        console.error(`The error is from function: setDialogFocus: ${error}`);
    }
}

$('#dialogBox').off('.dialog-fix');
$('#dialogBox').on('shown.bs.modal.dialog-fix', function () {
    try{
        $('#wrapper').attr({
            'inert': 'true'
        })
        var button = $("#dialogBox #btn_custommsg_1");
        button.on('click', function(){
            $('#wrapper').removeAttr('inert');
        });
    }
    catch(error){
        console.error(`The error is from dialouge box foucus set using inert: ${error}`);
    }
});
