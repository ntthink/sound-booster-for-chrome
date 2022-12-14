let tabUrl2 = window.location.href;
let referrer = document.referrer;

chrome.runtime.sendMessage({msg: "currentUrl", currentUrl: tabUrl2, referrer})