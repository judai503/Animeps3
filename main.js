var page = require('showtime/page');
var service = require('showtime/service');
var settings = require('showtime/settings');
var http = require('showtime/http');
var string = require('native/string');
var popup = require('native/popup');
var store = require('movian/store');
var plugin = JSON.parse(Plugin.manifest);
var logo = Plugin.path + 'logo.png';
var background = Plugin.path + 'bg.png';

RichText = function(x) {
  this.str = x.toString();
};

RichText.prototype.toRichString = function(x) {
  return this.str;
};

function setPageHeader(page, title) {
  if (page.metadata) {
    page.metadata.title = new RichText(decodeURIComponent(title));
    page.metadata.logo = logo;
    page.metadata.background = background;
  }
  page.type = 'directory';
  page.contents = 'items';
  page.loading = false;
}

var orange = 'FFA500';
var blue = '6699CC';

function coloredStr(str, color) {
  return '<font color="' + color + '">' + str + '</font>';
}

service.create(plugin.title, plugin.id + ':start', 'video', true, logo);

var linkStore = store.create('directlinks');
if (!linkStore.list) {
  linkStore.list = '[]';
}

settings.globalSettings(plugin.id, plugin.title, logo, plugin.synopsis);
settings.createAction('clearLinks', 'Clear all links', function() {
  linkStore.list = '[]';
  popup.notify('All links have been removed', 2);
});

function getLinks() {
  try {
    return JSON.parse(linkStore.list);
  } catch(e) {
    return [];
  }
}

function saveLink(url, title, icon) {
  var links = getLinks();
  
  for (var i = 0; i < links.length; i++) {
    if (links[i].url === url) {
      popup.notify('This link already exists', 2);
      return;
    }
  }
  
  links.push({
    url: url,
    title: title,
    icon: icon || logo,
    date: Date.now()
  });
  
  linkStore.list = JSON.stringify(links);
}

function removeLink(pos) {
  var links = getLinks();
  links.splice(pos, 1);
  linkStore.list = JSON.stringify(links);
}

function addOptionForRemovingLink(page, item, title, pos) {
  item.addOptAction('Remove "' + title + '" from list', function() {
    popup.notify('"' + title + '" has been removed', 2);
    removeLink(pos);
    page.redirect(plugin.id + ':start');
  });
}

new page.Route(plugin.id + ':start', function(page) {
  setPageHeader(page, plugin.title);

  page.appendItem('', 'separator', {
    title: 'Add Link'
  });

  page.appendItem(plugin.id + ':addLink', 'item', {
    title: 'Add new link',
    icon: logo,
    description: 'Enter a direct link (MP4, MKV, MP3, M4A, etc.)'
  });

  page.appendItem('', 'separator', {
    title: 'My Links'
  });

  var links = getLinks();
  
  if (links.length > 0) {
    for (var i = links.length - 1; i >= 0; i--) {
      var link = links[i];
      var date = new Date(link.date);
      
      var item = page.appendItem(plugin.id + ':play:' + escape(link.url) + ':' + escape(link.title) + ':' + escape(link.icon || logo), 'video', {
        title: link.title,
        icon: link.icon || logo,
        description: new RichText(
          coloredStr('Link: ', orange) + link.url + 
          '<br>' + coloredStr('Added: ', blue) + date.toLocaleString()
        )
      });
      
      addOptionForRemovingLink(page, item, link.title, i);
    }
    
    page.metadata.title = new RichText(plugin.title + ' (' + links.length + ')');
  } else {
    page.appendItem('', 'label', {
      title: 'No saved links'
    });
    
    page.appendItem('', 'label', {
      title: 'Press "Add new link" to get started'
    });
  }

  page.loading = false;
});

new page.Route(plugin.id + ':addLink', function(page) {
  page.type = 'directory';
  page.contents = 'items';
  page.metadata.background = background;
  page.loading = false;
  
  var urlInput = popup.textDialog('Enter media URL:\n(must start with http:// or https://)', true, true);
  
  if (urlInput.rejected || !urlInput.input || urlInput.input.length === 0) {
    popup.notify('Operation cancelled', 2);
    page.redirect(plugin.id + ':start');
    return;
  }
  
  var url = urlInput.input;
  
  if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
    popup.notify('Invalid URL. Must start with http:// or https://', 3);
    page.redirect(plugin.id + ':start');
    return;
  }
  
  var titleInput = popup.textDialog('Media title (optional):', true, true);
  
  var title;
  if (titleInput.rejected || !titleInput.input || titleInput.input.length === 0) {
    var urlParts = url.split('/');
    var fileName = urlParts[urlParts.length - 1].split('?')[0];
    title = decodeURIComponent(fileName) || 'Direct media';
  } else {
    title = titleInput.input;
  }
  
  var iconInput = popup.textDialog('Cover image URL (optional):', true, true);
  
  var icon = logo;
  if (!iconInput.rejected && iconInput.input && iconInput.input.length > 0) {
    if (iconInput.input.indexOf('http://') === 0 || iconInput.input.indexOf('https://') === 0) {
      icon = iconInput.input;
    }
  }
  
  saveLink(url, title, icon);
  
  popup.notify('"' + title + '" added successfully', 2);
  
  page.redirect(plugin.id + ':start');
});

new page.Route(plugin.id + ':play:(.*):(.*):(.*)', function(page, encodedUrl, encodedTitle, encodedIcon) {
  var url = unescape(encodedUrl);
  var title = unescape(encodedTitle);
  var icon = unescape(encodedIcon);
  
  page.type = 'video';
  page.source = 'videoparams:' + JSON.stringify({
    title: title,
    icon: icon,
    canonicalUrl: plugin.id + ':play:' + encodedUrl + ':' + encodedTitle + ':' + encodedIcon,
    sources: [{
      url: url
    }],
    no_fs_scan: true,
    no_subtitle_scan: true
  });
  
  page.loading = false;
});