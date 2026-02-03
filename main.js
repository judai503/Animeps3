var page = require('movian/page');
var service = require('movian/service');

service.create("AnimePS3", "animeps3:start", "video", true);

page.Route("animeps3:start", function (page) {
    page.metadata.title = "AnimePS3";
    page.appendItem("", "directory", {
        title: "Funciona correctamente"
    });
    page.loading = false;
});
