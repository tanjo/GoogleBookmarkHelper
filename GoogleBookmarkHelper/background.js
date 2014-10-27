function checkUrl(url) {
  var url = "https://www.google.com/bookmarks/find?output=xml&q=" + url;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var responseXML = xhr.responseXML.documentElement;
      var xmlApiReply = responseXML.getElementsByTagName("xml_api_reply");
      var bookmarks = responseXML.getElementsByTagName("bookmarks");
      var url = responseXML.getElementsByTagName("url");
      if (bookmarks.length > 0 && url.length > 0) {
        chrome.browserAction.setIcon({"path":"icon_red.png"});
      } else {
        chrome.browserAction.setIcon({"path":"icon.png"});
      }
    }
  };
  xhr.send();
}

function keyPhrase(text, callback) {
  var yURL = "http://jlp.yahooapis.jp/KeyphraseService/V1/extract?appid={%appid%}&sentence="
           + encodeURIComponent(text)
           + "&output=json";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", yURL, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // JSON.parse does not evaluate the attacker's scripts.
      var resp = JSON.parse(xhr.responseText);
      callback(resp);
    }
  }
  xhr.send();
}

function getNow() {
  var d = new Date();
  var yyyy = d.getFullYear();
  var mm = ("0" + (d.getMonth()+1)).slice(-2);
  var dd = ("0" + d.getDate()).slice(-2);
  return yyyy+"-"+mm+"-"+dd;
}

function bookmark(label, title, url, selectedText) {
  label = getNow() + label;
  var url = "http://www.google.com/bookmarks/mark?op=edit&bkmk="
          + encodeURIComponent(url)
          + "&title="
          + encodeURIComponent(title)
          + "&labels="
          + label
          + "&annotation="
          + encodeURIComponent(selectedText);
  openPopup(url);
}

function openPopup(url) {
  chrome.tabs.create({ url : url });
}

chrome.browserAction.onClicked.addListener(function(activeTab) {
  chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
  }, function(selection) {
    chrome.tabs.getSelected(null,function(tab) {
      keyPhrase(tab.title, function(responseJson) {
        var label = "";
        for (var key in responseJson) {
          label += "," + key;
        }
        bookmark(label, tab.title, tab.url, selection);
      });
    });
  });
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    checkUrl(tab.url);
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  checkUrl(tab.url);
});
