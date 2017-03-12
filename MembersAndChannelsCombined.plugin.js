//META{"name":"MembersAndChannelsCombined"}*//

var MembersAndChannelsCombined = function () {};
var MCC = MembersAndChannelsCombined;



/***           SETTINGS           ****/


function Setting(name, value, type){
    this.name = name;
    this.value = value;
    this.type = type;
}
//Defaults
MembersAndChannelsCombined.settings = {};
MembersAndChannelsCombined.version = "0.1.1";
//Default is for minified mode.
MembersAndChannelsCombined.settings.left_bar_width = new Setting("Left Bar Width","160px","css");
MembersAndChannelsCombined.settings.channel_height = new Setting("Channel List Height","50%","css");
MembersAndChannelsCombined.settings.members_height = new Setting("Member List Height","50%","css");





/********************************************************************************************/


MembersAndChannelsCombined.prototype.moveElements = function (){
    $(".guilds-wrapper").after("<div class='LeftSideDiv flex-vertical' style='width:"+MCC.settings.left_bar_width.value+"'></div>");
    $(".channels-wrap").appendTo($(".LeftSideDiv"));
    //Share height equally with members and set width to be the same as channel-members-wrap which is 240px
    $(".channel-members-wrap").appendTo($(".LeftSideDiv"));
    $("div.account").appendTo($(".LeftSideDiv"));
    MembersAndChannelsCombined.prototype.applyCSS();

};

MembersAndChannelsCombined.prototype.applyCSS = function (){
    $(".channels-wrap").css("height",MCC.settings.channel_height.value).css("width","inherit");
    $(".channel-members-wrap").css("height",MCC.settings.members_height.value).css("width","inherit").css("min-width","inherit");
    $(".channel-members").css("max-width", MCC.settings.left_bar_width.value);
    $("div.account").css("flex-wrap","wrap");
    if($(".LeftSideDiv").length){
        $(".LeftSideDiv").css("width",MCC.settings.left_bar_width.value);
    }
};

MembersAndChannelsCombined.prototype.resetElements = function (){
            if ( $(".LeftSideDiv").length){
                $(".channel-members-wrap").appendTo($(".content.flex-spacer.flex-horizontal"));
                $(".channels-wrap").unwrap();
                $("div.account").appendTo($(".channels-wrap"));
                MembersAndChannelsCombined.prototype.resetCSS();
            }
};

MembersAndChannelsCombined.prototype.resetCSS = function (){
    $(".channels-wrap").css("height","").css("width","");
    $(".channel-members-wrap").css("height","").css("width","").css("min-width","");
    $(".channel-members").css("max-width", "240px"); //default
    $("div.account").css("flex-wrap","");

}
MembersAndChannelsCombined.prototype.onMessage = function () {
    //Supposedly runs when receiving a message
};
MembersAndChannelsCombined.prototype.onSwitch = function () {
    //Seems like it activates when switching between chats, does not activate if you go from DM friends to server chat
    //activates multiple times for some reason
};

MembersAndChannelsCombined.prototype.start = function () {
    console.log("MembersAndChannelsCombined Start");
    var observer = new MutationObserver(function (mutations, me){
        if($(".LeftSideDiv").length){
            me.disconnect();
        }else{
            if($(".channel-members-wrap").length && $(".LeftSideDiv").length == 0){
                MembersAndChannelsCombined.prototype.moveElements();
            }
        }
        
    });
    observer.observe($("section.flex-horizontal.flex-spacer")[0],{
      childList: true,
      subtree: true
    });

    $("a").on("click.MembersAndChannelsCombined",function(e){
        if (e.target.className == "friends-icon") {
            MembersAndChannelsCombined.prototype.resetElements();

        }
    });
    //checks for clicks on icons on left side
    $(".guilds-wrapper").on("click.MembersAndChannelsCombined",".avatar-small",function(e){

        //Reset if going to DMs
        if(e.target.href.includes("channels/@me")){
            if ( $(".LeftSideDiv").length){ //only reset if we need to
                MembersAndChannelsCombined.prototype.resetElements();
            }
            return;
        }
        else
        { //Restart the observer when we go to server
            observer.observe($("section.flex-horizontal.flex-spacer")[0],{
              childList: true,
              subtree: true
            });
        }
    });

    if($(".channel-members-wrap")[0] && $(".channels-wrap")[0]){
       MembersAndChannelsCombined.prototype.moveElements();
    }
};
MembersAndChannelsCombined.prototype.load = function () {
    console.log("MembersAndChannelsCombined loading");
    var loadedSettings = bdPluginStorage.get("MembersAndChannelsCombined", "settings");
    for (var attrname in loadedSettings) { MCC.settings[attrname] = loadedSettings[attrname]; }

};

MembersAndChannelsCombined.prototype.unload = function () {
    console.log("unload");
    $("a.avatar-small").off("click.MembersAndChannelsCombined");
    $("a").off("click.MembersAndChannelsCombined");
    $(".guilds-wrapper").off("click.MembersAndChannelsCombined");
};
MembersAndChannelsCombined.prototype.stop = function () {
    console.log("Stop");
    $("a.avatar-small").off("click.MembersAndChannelsCombined");
    $("a").off("click.MembersAndChannelsCombined");
    $(".guilds-wrapper").off("click.MembersAndChannelsCombined");
    MembersAndChannelsCombined.prototype.resetElements();
};
MembersAndChannelsCombined.prototype.getSettingsPanel = function () {
    var loadedSettings = bdPluginStorage.get("MembersAndChannelsCombined", "settings");
    var maybeOldVersion = bdPluginStorage.get("MembersAndChannelsCombined", "version");
    var html = document.createElement("div");
    html.id = "MCCSettingsDiv";
    var title = document.createElement("h1");
    title.innerHTML = "Members and Channels Combined Settings";
    html.appendChild(title);

    for (var attrname in MCC.settings) {
        html.appendChild(makeSettingHTML(attrname, MCC.settings[attrname]));
    }
    var buttonDiv = document.createElement("div");
    buttonDiv.className="MCCSetting flex-horizontal flex-spacer";
    buttonDiv.style = "justify-content:space-between;";

    //Make save button
    var button = document.createElement("button");
    button.setAttribute("onclick","MembersAndChannelsCombined.prototype.save()");
    button.innerHTML="Save";
    buttonDiv.appendChild(button);

    button = document.createElement("button");
    button.setAttribute("onclick","MembersAndChannelsCombined.prototype.saveAndReload()");
    button.innerHTML="Save and Reload";
    buttonDiv.appendChild(button);
    html.appendChild(buttonDiv);
    $(".callout-backdrop").css("opacity",0.2);
    return html;
};
MembersAndChannelsCombined.prototype.save = function() {
    //Make settings apply to current.
    $(".MCCSetting input").each(function(idx, setting){
        MCC.settings[setting.id].value = setting.value;
    });
    bdPluginStorage.set("MembersAndChannelsCombined", "settings", MembersAndChannelsCombined.settings);
    bdPluginStorage.set("MembersAndChannelsCombined", "version", MembersAndChannelsCombined.version);
    if($("#MCCSavedNotif").length == 0){
        $("#MCCSettingsDiv").append("<p id='MCCSavedNotif'> Saved! </p>");
    }
}
MembersAndChannelsCombined.prototype.saveAndReload = function(){
    MembersAndChannelsCombined.prototype.save();
    MembersAndChannelsCombined.prototype.reload();
}
MembersAndChannelsCombined.prototype.reload = function(){
    MembersAndChannelsCombined.prototype.resetCSS();
    MembersAndChannelsCombined.prototype.applyCSS();
}

MembersAndChannelsCombined.prototype.getName = function () {
    return "Members and Channels Combined";
};
MembersAndChannelsCombined.prototype.getDescription = function () {
    return "This plugin combines the list of Channels and the Member list into the left area used by the channels.<br> This saves you the area usually taken up by the member list.";
};
MembersAndChannelsCombined.prototype.getVersion = function () {
    return "0.1";
};
MembersAndChannelsCombined.prototype.getAuthor = function () {
    return "Zednosius";
};

function makeSettingHTML(id, setting){
    if(setting.type == "css"){
        return getCssSettingHTML(id,setting.name,setting.value);
    }

    return "NO HTML CREATOR FOUND"
}
function getCssSettingHTML(id, name, value){
    var div = document.createElement("div");
    div.className="MCCSetting flex-horizontal flex-spacer";
    div.style = "justify-content:space-between;";
    var label = document.createElement("label");
    label.for = id;
    label.innerHTML = name;

    var input = document.createElement("input");
    input.type = "text";
    input.value = value;
    input.id = id;

    div.appendChild(label);
    div.appendChild(input);
    return div;
}
