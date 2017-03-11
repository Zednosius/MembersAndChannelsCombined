//META{"name":"MembersAndChannelsCombined"}*//

var MembersAndChannelsCombined = function () {};

window.onload = function() {
  console.log("Sup foo");
      $(document).ready(function () {
    console.log("DOCUMENT IS READY!");
    });
};


MembersAndChannelsCombined.prototype.moveElements = function (){
            $(".guilds-wrapper").after("<div class='LeftSideDiv flex-vertical' style='width:160px'></div>");
            $(".channels-wrap").appendTo($(".LeftSideDiv"));
            //Share height equally with members and set width to be the same as channel-members-wrap which is 240px
            $(".channels-wrap").css("height","50%");//.css("width","180px");

            $(".channel-members-wrap").appendTo($(".LeftSideDiv"));
            $(".channel-members-wrap").css("height","50%");//.css("width","180px");
            $("div.account").appendTo($(".LeftSideDiv"));

};
MembersAndChannelsCombined.prototype.resetElements = function (){
            if ( $(".LeftSideDiv").length){

                $(".channel-members-wrap").appendTo($(".content.flex-spacer.flex-horizontal"));

                $(".channels-wrap").unwrap();
                $(".channels-wrap").css("height","").css("width","");
                $(".channel-members-wrap").css("height","");
                $("div.account").appendTo($(".channels-wrap"));

            }
};
MembersAndChannelsCombined.prototype.onMessage = function () {
    //Not sure what this does
};
MembersAndChannelsCombined.prototype.onSwitch = function () {
    //Seems like it activates when switching between chats, does not activate if you go from DM friends to server chat
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
            console.log("Clicked DMs");
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
    return "<h3>Settings Panel</h3>";
};

MembersAndChannelsCombined.prototype.getName = function () {
    return "Members and Channels Combined";
};
MembersAndChannelsCombined.prototype.getDescription = function () {
    return "This plugin combines the list of Channels and the Member list into the left area used by the channels, sharing the height of it equally between them.<br> This saves you the area usually taken up by the member list.";
};
MembersAndChannelsCombined.prototype.getVersion = function () {
    return "0.1";
};
MembersAndChannelsCombined.prototype.getAuthor = function () {
    return "Zednosius";
};