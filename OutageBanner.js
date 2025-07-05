let outageBannerData = "";
let outageBannerDataMob = "";
let brandingTop = 100;
let brandingTopMob = 100;
function outageBanner(outageJson) {
  let outageData = outageJson;
  outageBannerData = "";
  outageBannerDataMob = "";
  brandingTop = 100;
  brandingTopMob = 100;

  //identify parent - remove banners
  //let parent = document.getElementById("outage-banner")
  var parent = document.getElementsByClassName("cl-dark_moon");
  var filteredParent = Array.from(parent).find(
    (el) => el.classList.length === 1
  );

  if (filteredParent) {
    if (!filteredParent.querySelector("#outage-banner")) {
      var div = document.createElement("div");
      div.id = "outage-banner";
      div.style.position = "relative";
      div.style.zIndex = "999";
      filteredParent.appendChild(div);
    }
  }
  parent = document.getElementById("outage-banner");
  while (parent.hasChildNodes()) {
    parent.removeChild(parent.firstChild);
  }

  let updatedJsonString = outageData.replace(/<a /g, '<a target=\\"_blank\\" ');
  //let data = JSON.parse(outageData);
  let data = JSON.parse(updatedJsonString);
  //new changes
  data.forEach(function (element) {
    buildoutageBanner(element);

    /*let parentmob = document.getElementById("outage-banner-mob")
      while (parentmob.hasChildNodes()) {
          parentmob.removeChild(parentmob.firstChild)
      }
      $('#outage-banner-mob').append(outageBannerDataMob);*/
    $("#outage-banner").append(outageBannerData);

    setOutageBannerTop();
    outageBannerData = "";
    //outageWindowResize();
  });
  setStyleWhenDiv();
}

function buildoutageBanner(elmnt) {
  //data.forEach(function (elmnt) {
  var outageBannerVisibility;
  var closeVisibility;
  if (elmnt.bannerVisibility.toLowerCase() == "true") {
    outageBannerVisibility = "flex";
    if (elmnt.showClose.toLowerCase() == "true") {
      closeVisibility = "flex";
    } else {
      closeVisibility = "none";
    }
  } else {
    outageBannerVisibility = "none";
  }
  outageBannerData =
    outageBannerData +
    `<div class="o-banner ` +
    elmnt.bannerName +
    `" id="` +
    elmnt.bannerName +
    `" bannerindex="` +
    elmnt.bannerIndex +
    `" style="height: auto;background-color: ` +
    elmnt.backgroundColor +
    `;padding: 5px 20px;text-align: center;display: ` +
    outageBannerVisibility +
    `;justify-content: space-between;border-top: 1px solid #fff;"><p id="` +
    elmnt.bannerName +
    `_p" style="height: auto;line-height: 25px;font-size: 14px;font-family: 'RobotoRegular';color:` +
    elmnt.fontColor +
    `;width: 96%;white-space: pre-wrap;word-break: break-all;">` +
    elmnt.validationMsg +
    `</p> <a id="` +
    elmnt.bannerName +
    `_a" style="height: auto;line-height: 35px;font-size: 17px;font-family: 'RobotoRegular';color:` +
    elmnt.fontColor +
    `;cursor: pointer;display: ` +
    closeVisibility +
    `;" title="Close" tabindex="1" aria-label="Close Outage` +
    elmnt.bannerName +
    `" role="button"><i class='fa fa-close'></i></a></div>`;
  outageBannerDataMob =
    outageBannerDataMob +
    `<div class="o-banner ` +
    elmnt.bannerName +
    `" id="` +
    elmnt.bannerName +
    `_mob" bannerindex="` +
    elmnt.bannerIndex +
    `" style="height: auto;background-color: ` +
    elmnt.backgroundColor +
    `;padding: 5px 20px;text-align: center;display: ` +
    outageBannerVisibility +
    `;justify-content: space-between;border-top: 1px solid #fff;"><p id="` +
    elmnt.bannerName +
    `_mob_p" style="height: auto;line-height: 25px;font-size: 14px;font-family: 'RobotoRegular';color:` +
    elmnt.fontColor +
    `;width: 96%">` +
    elmnt.validationMsg +
    `</p><a id="` +
    elmnt.bannerName +
    `_mob_a" style="height: auto;line-height: 25px;font-size: 17px;font-family: 'RobotoRegular';color:` +
    elmnt.fontColor +
    `;cursor: pointer;display: ` +
    closeVisibility +
    `;white-space: pre-wrap;word-break: break-all;" title="Close" tabindex="1" aria-label="Close Outage` +
    elmnt.bannerName +
    `" role="button"><i class='fa fa-close'></i></a></div>`;

  //});
}

var closedIndex = "";
function bannerCloseClick(event, arg) {
  let closeId = $(arg).attr("id");
  //let bannerId = document.getElementById(closeId).parentElement.id;
  let bannerId = document.getElementById(closeId).closest(".o-banner").id;
  if (!closedIndex) closedIndex += $("#" + bannerId).attr("bannerindex");
  else closedIndex += "," + $("#" + bannerId).attr("bannerindex");
  bannerId = bannerId.replace("_mob", "");
  outageBannerStyle("." + bannerId, "", "", "", "false", "");
  var orderBannerIndex = document.getElementsByName("txtBannerIndex");
  if (orderBannerIndex.length > 0) {
    $(orderBannerIndex).val(closedIndex).trigger("change");
  } else {
    console.log('TextBox with name "txtBannerIndex" not found!');
  }
  setOutageBannerTop();
}

function outageBannerStyle(
  ctrl,
  ctrlcolor,
  msg,
  msgcolor,
  showhide,
  showclose
) {
  if (showhide.toLowerCase() == "true") {
    $(ctrl + " p").css({ color: msgcolor });
    $(ctrl + " p").text(msg);
    $(ctrl + " a").css({ color: msgcolor });
    $(ctrl).css({ "background-color": ctrlcolor });
    $(ctrl).css({ display: "flex" });
    if (showclose.toLowerCase() == "false")
      $(ctrl + " a").css({ display: "none" });
  } else {
    $(ctrl).css({ display: "none" });
    //outageWindowResize();
  }
}

function buildOutageBanner(data) {
  outageBanner(data);
  $(".o-banner a").on("click keypress", function (e) {
    bannerCloseClick(e, this);
  });
}

function outageBannerfromForm(
  ctrl,
  ctrlcolor,
  msg,
  msgcolor,
  showhide,
  showclose
) {
  outageBannerStyle("#" + ctrl, ctrlcolor, msg, msgcolor, showhide, showclose);
}

function setOutageBannerTop() {
  try {
    const banner = document.getElementById("outage-banner");
    const wrapper = document.getElementById("wrapper");
    const navbar = document.querySelector(".navbar");

    let bannerHeight = banner ? banner.clientHeight : 0;
    let navbarHeight = navbar ? navbar.clientHeight : 0;
    let totalHeight = bannerHeight + navbarHeight;

    // Push wrapper down
    // wrapper.style.setProperty('top', totalHeight+ 'px', 'important');

    // Reduce wrapper height to maintain full screen space
    let newHeight = window.innerHeight - totalHeight;
    wrapper.style.setProperty("height", newHeight + "px", "important");
    wrapper.style.setProperty("height", "100vh", "important");
  } catch (error) {
    console.error("Error in setOutageBannerTop:", error);
  }
}

function setStyleWhenDiv() {
  try {
    document.querySelectorAll(".o-banner").forEach(function (banner) {
      if (banner.querySelector("div")) {
        banner.style.display = "flex";
        banner.style.flexDirection = "column";
      }
    });
  } catch (error) {
    console.error(`Error in function setStyleWhenDiv: ${error}`);
  }
}
