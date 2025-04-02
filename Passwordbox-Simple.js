function passwordBox(ctrlId, lblEyeId) {
    try {
        let textBox = $("#" + ctrlId);
        let lblEye = $("#" + lblEyeId);

        lblEye.on("click", function () {
            let isPasswordVisible = textBox.attr("type") === "text";

            if (isPasswordVisible) {
                textBox.attr("type", "password");
                lblEye.find("label i").removeClass("fa-eye-slash").addClass("fa-eye");
            } 
            else {
                textBox.attr("type", "text");
                lblEye.find("label i").removeClass("fa-eye").addClass("fa-eye-slash");
            }
        });
    } 
    catch (e) {
        console.error("Issue with PasswordBox(): " + e);
    }
}