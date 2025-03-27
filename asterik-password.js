//debounce function
const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
};

const debounceChange = debounce((targetCtrl, value) => {
    if (targetCtrl.val() !== value) {
        targetCtrl.val(value).trigger("change");
    }
}, 300);

function passwordHide(txtPasswordId, lblEyeId, trgtCtrlId){
    try{
        let txtPassword = $("#"+txtPasswordId);
        let lblEye = $("#"+lblEyeId);
        let trgtCtrl = $("#"+trgtCtrlId);
        let passwordValue = '';
        let passwordLength;
        let cursorPos; 
        let clickCursorPos;
        let ctrlA = false;
        let isArrowUsed = false;
        let cursorPosArrow = 0;
        const maxLength = 16;

        txtPassword.off(".passwordBox");
        lblEye.off(".passwordBox");

        txtPassword.on({"keydown.passwordBox" : function(e){
            
            if (
                e.key === "Backspace" || 
                e.key === "Delete" ||  
                e.key === "Tab" || 
                e.key === "Enter" || 
                e.key === "Home" || 
                e.key === "End" || 
                e.key === "Alt" ||
                e.ctrlKey ||
                (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x'))
            ) { return; }
            if(passwordValue.length >= maxLength){
                e.preventDefault();
            }
            if (e.key === '.' || e.keyCode === 190) {
                e.preventDefault();
            }

            cursorPosArrow = $(this).prop("selectionStart");
            if(e.ctrlKey && e.key === "a"){
                ctrlA = true;
                clickCursorPos = null;
            }

            if (e.key === "ArrowLeft" && cursorPosArrow > 0) {
                cursorPosArrow--;
                ctrlA = false;
                isArrowUsed = true;
                clickCursorPos = null;
            } else if (e.key === "ArrowRight" && cursorPosArrow < passwordValue.length) {
                cursorPosArrow++;
                ctrlA = false;
                isArrowUsed = true;
                clickCursorPos = null;
            }

            if(e.key === "Home"){
                cursorPosArrow = 0;
                ctrlA = false;
                isArrowUsed = true;
                clickCursorPos = null;
            }
            else if(e.key === "End"){
                cursorPosArrow = passwordValue.length;
                ctrlA = false;
                isArrowUsed = true;
                clickCursorPos = null;
            }
            
        },
        "copy.passwordBox" : function(e){
            e.preventDefault(); 
        }
        });

        txtPassword.on("click.passwordBox", function(e) {
            ctrlA = false;
            isArrowUsed = false;
            clickCursorPos = $(this).prop("selectionStart");
        });

        txtPassword.on("select.passwordBox", function(){
            let start = this.selectionStart;
            let end = this.selectionEnd;
            passwordValue = passwordValue.substring(0, start) + passwordValue.substring(end);
        });

        txtPassword.on("input.passwordBox paste.passwordBox", function(e){
            cursorPos = txtPassword.prop("selectionStart"); 

            if(txtPassword.val().length === 0){
                passwordValue = '';
                passwordLength = 0;
                ctrlA = false;
                isArrowUsed = false;
            }

            if (e.type === "paste") {
                let pastedText = e.originalEvent.clipboardData.getData("text");

                if(ctrlA){
                    passwordValue = pastedText;
                    passwordLength = passwordValue.length;
                    txtPassword.val("*".repeat(passwordLength));
                    ctrlA = false;
                    isArrowUsed = false;
                }
                else
                {
                    let pastedTextLength = pastedText.length;
                    if(clickCursorPos !== null && clickCursorPos < passwordValue.length){
                        if((passwordLength + pastedTextLength) >= maxLength){
                            let availableLength = maxLength - passwordLength;
                            pastedText = pastedText.slice(0, availableLength);
                        }
                        passwordValue = passwordValue.slice(0, clickCursorPos) + pastedText + passwordValue.slice(clickCursorPos);
                        passwordLength = passwordValue.length;
                        txtPassword.val("*".repeat(passwordLength));
                        clickCursorPos += pastedText.length;
                        txtPassword.get(0).setSelectionRange(clickCursorPos, clickCursorPos); 
                    }
                    else if(isArrowUsed){
                        if((passwordLength + pastedTextLength) >= maxLength){
                            let availableLength = maxLength - passwordLength;
                            pastedText = pastedText.slice(0, availableLength);
                        }
                        passwordValue = passwordValue.slice(0, cursorPosArrow) + pastedText + passwordValue.slice(cursorPosArrow);
                        passwordLength = passwordValue.length;
                        txtPassword.val("*".repeat(passwordLength));
                        cursorPosArrow += pastedText.length;
                        txtPassword.get(0).setSelectionRange(cursorPosArrow, cursorPosArrow); 
                    }
                    else{
                        if((passwordLength + pastedTextLength) >= maxLength){
                            let availableLength = maxLength - passwordLength;
                            pastedText = pastedText.slice(0, availableLength);
                        }
                        passwordValue = passwordValue.slice(0, cursorPos) + pastedText + passwordValue.slice(cursorPos);
                        passwordLength = passwordValue.length;
                        txtPassword.val("*".repeat(passwordLength));
                        cursorPos += pastedText.length;
                        txtPassword.get(0).setSelectionRange(cursorPos, cursorPos); 
                    }
                    if(trgtCtrl.val() != passwordValue){
                        debounceChange(trgtCtrl, passwordValue);
                    }
                    isArrowUsed = false;
                }
            } 

            if(e.originalEvent.inputType === "deleteContentBackward") {
                passwordValue = passwordValue.slice(0, cursorPos) + passwordValue.slice(cursorPos+1);
                passwordLength = passwordValue.length;
                clickCursorPos = null;
            }

            if(e.originalEvent.data){
                passwordValue = passwordValue.slice(0, cursorPos-1) + e.originalEvent.data + passwordValue.slice(cursorPos-1);
                passwordLength = passwordValue.length;
                txtPassword.val("*".repeat(passwordLength));
                txtPassword.get(0).setSelectionRange(cursorPos, cursorPos);
                clickCursorPos = null;
            }

            if(trgtCtrl.val() != passwordValue){
                debounceChange(trgtCtrl, passwordValue);
            }

        });

        txtPassword.on("focusout.passwordBox", function(e){
            if(trgtCtrl.val() != passwordValue){
                debounceChange(trgtCtrl, passwordValue);
            }
        });
        
        lblEye.on("mousedown.passwordBox", function(){
            txtPassword.val(passwordValue);
            lblEye.find("label i").toggleClass("fas fa-eye");
            lblEye.find("label i").toggleClass("fas fa-eye-slash");
        });
        lblEye.on("mouseup.passwordBox", function(){
            txtPassword.val("*".repeat(passwordLength));
            lblEye.find("label i").toggleClass("fas fa-eye");
            lblEye.find("label i").toggleClass("fas fa-eye-slash");
        });        
    }
    catch(exception){
        console.error("Error in PasswordHide: "+exception);
    }
}
