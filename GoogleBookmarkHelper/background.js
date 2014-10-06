function keyPhrase(text, callback) {
  var yURL = "http://jlp.yahooapis.jp/KeyphraseService/V1/extract?appid={%appid%}&sentence="
           + encodeURIComponent(text)
           + "&output=json";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", yURL, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // JSON.parse does not evaluate the attacker's scripts.
      console.log(xhr.responseText);
      var resp = JSON.parse(xhr.responseText);
      console.log(resp);
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

function bookmark(label, title, url) {
  label = getNow() + label;
  var url = "http://www.google.com/bookmarks/mark?op=edit&bkmk="
          + encodeURIComponent(url)
          + "&title="
          + encodeURIComponent(title)
          + "&labels="
          + label;
  openPopup(url);
}

function openPopup(url) {
  chrome.tabs.create({ url : url });
}

chrome.browserAction.onClicked.addListener(function(activeTab) {
  chrome.tabs.getSelected(null,function(tab) {
      keyPhrase(tab.title, function(responseJson) {
        var label = "";
        for (var key in responseJson) {
          label += "," + key;
        }
        bookmark(label, tab.title, tab.url);
      });
    });
});
