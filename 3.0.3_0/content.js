let tabUrl = window.location.href
console.log(tabUrl, "content page")
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log()
  if (msg.from == "volume_increased") {
    if (tabUrl.includes("primevideo")) {
      console.log("this is prime video url")
      let vid = document.getElementsByTagName("video")
      for (let i = 0; i < vid.length; i++) {
        if (vid[i].src.includes("blob")) {
          vid[i].muted = false
        }
      }
    }
    else {
      let vid = document.getElementsByTagName("video")[0]
      vid.muted = false
    }
  }
});