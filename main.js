var page = require('movian/page');
var service = require('movian/service');
var plugin = JSON.parse(Plugin.manifest);

var logo = Plugin.path + "logo.png";
var background = Plugin.path + "bg.png";

service.create(plugin.title, plugin.id + ":start", "video", true, logo);

function setHeader(page, title){
    page.metadata.title = title;
    page.metadata.logo = logo;
    page.metadata.background = background;
    page.type = "directory";
    page.contents = "items";
    page.loading = false;
}

//////////////////////////////////////////////////////
// MENÚ PRINCIPAL
//////////////////////////////////////////////////////

new page.Route(plugin.id + ":start", function(page){

    setHeader(page, "AnimePS3");

    page.appendItem(plugin.id + ":tate", "directory", {
        title: "Tate no Yuusha no to aru Ichinichi",
        icon: logo
    });

});

//////////////////////////////////////////////////////
// SERIE
//////////////////////////////////////////////////////

new page.Route(plugin.id + ":tate", function(page){

    setHeader(page, "Tate no Yuusha no to aru Ichinichi");

    page.appendItem(
        "https://www.dropbox.com/scl/fi/r8fv810uxz0d4ae1497jo/AnimesBlack-Tate-no-Yuusha-no-Nariagari-02.mp4?rlkey=ormbpp9qr7qgyf7vpy720gvgp&dl=1",
        "video",
        {
            title: "Capítulo 2",
            icon: logo
        }
    );

});
