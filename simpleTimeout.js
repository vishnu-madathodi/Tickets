 function startIdleRedirectWatcher(idleTime, ctrlID, trgtCtrlID, dashboarName1, dashboarName2, dashboarName3) {
    try{
        let extFormName = $(`#${ctrlID} .innerframe`).attr("formname");
        let trgtCtrl = $(`#${trgtCtrlID}`);
        //let dashboardNames = ["Dashboard", "riskDashboard", "stakedashboard"];
        let dashboardNames = [dashboarName1, dashboarName2, dashboarName3];

        if(dashboardNames.includes(extFormName)){
            return ;
        }
        else{
            const maxIdleTime = idleTime * 60 * 1000;
            let lastActivity = Date.now();
            const lastActivityUpdate = () => {
                lastActivity = Date.now();
            }
    
            $(document).off(".idleWatcher");
            
            function checkIdleTime(){
                const now = Date.now();
                const timeSinceLastActiviy = now - lastActivity;
                if(timeSinceLastActiviy >= maxIdleTime){
                    debugger;
                    location.reload();
                    trgtCtrl.val("trigger").trigger("change");
                }
            }
    
            // Listen for activity
            $(document).on('mousemove.idleWatcher', lastActivityUpdate);
            $(document).on('keydown.idleWatcher', lastActivityUpdate);
            $(document).on('click.idleWatcher', lastActivityUpdate);
            $(document).on('scroll.idleWatcher', lastActivityUpdate);
        
            setInterval(checkIdleTime, 1000);
            lastActivityUpdate();
        }
    }
    catch(error){
        console.error(`Error in startIdleRedirectWatcher: ${error}`);
    }
}
