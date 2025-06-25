function selectLanguage(lang) {
    try {
        // Update the select element
        const select = document.getElementById('lang-select');
        select.value = lang;
        select.dispatchEvent(new Event('change'));
        checkSelectedLanguageCookie("Language");
        // Update the displayed language
        const langDisplay = document.getElementById('lang-display');
        if (lang === 'en') {
            langDisplay.textContent = 'English';
        } else if (lang === 'es') {
            langDisplay.textContent = 'Espanol';
        }
        if ($("#claysystabs .ui-tabs-panel:visible").find('#gcapatcha').length > 0) {
            languageSwitchCaptcha(lang)
        }

        // hide the languge dropdown
        const langSec = document.getElementById("lang-menu");
        langSec.classList.add('force-hide');

        document.getElementById("lang-display").addEventListener("click", ()=>{
            langSec.classList.remove('force-hide');
        });
    } catch (error) {
        console.error("Error occurred while checking the selected language:", error);
    }
}