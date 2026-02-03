var page = require('showtime/page');
var service = require('showtime/service');

var plugin = JSON.parse(Plugin.manifest);

var logo = Plugin.path + 'logo.png';
var background = Plugin.path + 'bg.jpg';

/* ========= CONFIG ========= */
var ANIME_NAME = 'Tate no Yuusha no Nariagari – to aru Ichinichi';

/* ⚠️ CAMBIA SOLO ESTA PARTE */
var EPISODES = [
  { num: 1, url: 'https://TU_LINK_EP01.mp4' },
  { num: 2, url: 'https://www.dropbox.com/scl/fi/r8fv810uxz0d4ae1497jo/AnimesBlack-Tate-no-Yuusha-no-Nariagari-02.mp4?dl=1' },
  { num: 3, url: 'https://TU_LINK_EP03.mp4' },
  { num: 4, url: 'https://TU_LINK_EP04.mp4' },
  { num: 5, url: 'https://TU_LINK_EP05.mp4' },
  { num: 6, url: 'https://TU_LINK_EP06.mp4' },
  { num: 7, url: 'https://TU_LINK_EP07.mp4' },
  { num: 8, url: 'https://TU_LINK_EP08.mp4' },
  { num: 9, url: 'https://TU_LINK_EP09.mp4' },
  { num: 10, url: 'https://TU_LINK_EP10.mp4' },
  { num: 11, url: 'https://TU_LINK_EP11.mp4' },
  { num: 12, url: 'https://TU_LINK_EP12.mp4' },
  { num: 13, url: 'https://TU_LINK_EP13.mp4' },
  { num: 14, url: 'https://TU_LINK_EP14.mp4' },
  { num: 15, url: 'https://TU_LINK_EP15.mp4' },
  { num: 16, url: 'https://TU_LINK_EP16.mp4' },
  { num: 17, url: 'https://TU_LINK_EP17.mp4' },
  { num: 18, url: 'https://TU_LINK_EP18.mp4' },
  { num: 19, url: 'https://TU_LINK_EP19.mp4' },
  { num: 20, url: 'https://TU_LINK_EP20.mp4' },
  { num: 21, url: 'https://TU_LINK_EP21.mp4' },
  { num: 22, url: 'https://TU_LINK_EP22.mp4' },
  { num: 23, url: 'https://TU_LINK_EP23.mp4' },
  { num: 24, url: 'https://TU_LINK_EP24.mp4' }
];

/* ========= SERVICIO ========= */
service.create(plugin.title, plugin.id + ':start', 'video', true, logo);

/* ========= MENÚ PRINCIPAL ========= */
new page.Route(plugin.id + ':start', function(page) {
  page.type = 'directory';
  page.contents = 'items';

  page.metadata.title = plugin.title;
  page.metadata.logo = logo;
  page.metadata.background = background;

  page.appendItem(plugin.id + ':anime:tate', 'directory', {
    title: ANIME_NAME,
    icon: logo
  });

  page.loading = false;
});

/* ========= LISTA DE EPISODIOS ========= */
new page.Route(plugin.id + ':anime:tate', function(page) {
  page.type = 'directory';
  page.contents = 'items';

  page.metadata.title = ANIME_NAME;
  page.metadata.background = background;

  EPISODES.forEach(function(ep) {
    page.appendItem(
      plugin.id + ':play:' + ep.num,
      'video',
      {
        title: 'Capítulo ' + ep.num,
        icon: logo
      }
    );
  });

  page.loading = false;
});

/* ========= REPRODUCTOR ========= */
new page.Route(plugin.id + ':play:(.*)', function(page, epNum) {
  var ep = EPISODES[epNum - 1];

  page.type = 'video';
  page.source = 'videoparams:' + JSON.stringify({
    title: ANIME_NAME + ' - Capítulo ' + ep.num,
    icon: logo,
    sources: [{
      url: ep.url
    }],
    no_fs_scan: true,
    no_subtitle_scan: true
  });

  page.loading = false;
});
