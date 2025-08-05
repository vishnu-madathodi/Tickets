function NVDAChanges(id){
    try {
            //need to call on event for new material combo box
            var comboBox = $("." + id + "-dropbtn");
            comboBox.find("span").attr("aria-hidden", "true");
            comboBox.attr({
                "role": "button",
                "aria-haspopup": "listbox"
            });
            var listBox = $("#" + id + "-wrapper");
            listBox.attr({
                "role": "listbox",
                "aria-hidden": "true"
            });
        
            listBox.find("li").each(function(){
                let isSelected = $(this).data("isselected") ? "true" : "false";
                $(this).attr({
                    "role": "option",
                    "aria-selected" : isSelected
                });
                $(this).find("a").attr({
                    "role": "option",
                });
                let optionTxt = $(this).find("a h5");
                optionTxt.attr({
                    "aria-label": optionTxt.text().trim(),
                    "role": "none",
                });
            });
            listBox.find("a.default-option").attr({"role": "option"});
            listBox.find("a.default-option h5").attr({
                "aria-label": "Select",
                "role": "none"
            });
        
    } catch(error) {
        console.error(Error in the function NVDAChanges: ${error});
    }

}
