$(document).ready(function () {
    try {
        // Check for iPhone
        var isiPhone = /iphone/i.test(navigator.userAgent);
        if (isiPhone) {
            // Set or create meta viewport tag
            var viewportContent = "width=device-width, initial-scale=1.0, user-scalable=0, maximum-scale=1, viewport-fit=cover";
            var $existingMeta = $('meta[name="viewport"]');
            if ($existingMeta.length) {
                $existingMeta.attr("content", viewportContent);
            } else {
                $('head').append('<meta name="viewport" content="' + viewportContent + '">');
            } 

            //padding to sf-main
            $(".sf-main").css("padding-bottom", "60px");

            // Set up MutationObserver on .sf-main
            const targetNode = document.querySelector('.sf-main');

            if (targetNode) {
                const config = { childList: true, subtree: true };

                const observer = new MutationObserver(function (mutationsList, observer) {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            // New nodes added – reattach events
                            attachEvent();
                            break;
                        }
                    }
                });

                observer.observe(targetNode, config);
            }
        }
    } catch (err) {
        console.error("iOS keyboard fix error:", err.message);
    }
});

function attachEvent() {
    $(".clcontrol-textbox").off('.bannerFix');
    $(".clcontrol-textbox").on("focusout.bannerFix blur.bannerFix", function () {
        window.scrollTo(0, 0);
        $('.public_banner').attr('style', 'height: calc(100vh - 80px) !important; top: 80px !important;');
    });
}
