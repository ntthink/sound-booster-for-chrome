var audioCtx = null;
var gainNode;
var vid;
let tabTitle = "";
let liveStream = null;
let tabid;

window.chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.msg === "Slidder_Triggered") {
            // window.chrome.storage.local.set({ "toggleStatus": e.target.checked })
            if (liveStream === null) {
                audioCtx = new (window.AudioContext)();

                window.chrome.tabCapture.capture({
                    audio: true,
                    video: false
                }, function (stream) {
                    chrome.tabs.query({ active: true, windowId: window.id },
                        function (tabs) {
                            tabTitle = tabs[0].title
                        }
                    )
                    if (stream) {
                        liveStream = stream
                        var source = audioCtx.createMediaStreamSource(stream);
                        var analyser = audioCtx.createAnalyser();
                        source.connect(analyser);
                        analyser.connect(audioCtx.destination);

                        gainNode = audioCtx.createGain();

                        source.connect(gainNode);

                        gainNode.connect(audioCtx.destination);
                        gainNode.gain.value = request.e;
                    }
                });
            }

            else if (audioCtx !== null && request.e > 0) {
                chrome.tabs.query({ active: true, windowId: window.id },
                    function (tabs) {
                        var tab = tabs[0].id
                        if (tabTitle !== tabs[0].title) {
                            tabTitle = tabs[0].title
                            liveStream.getAudioTracks()[0].stop()
                            window.chrome.tabCapture.capture({
                                audio: true,
                                video: false
                            }, function (stream) {
                                liveStream = stream
                                var source = audioCtx.createMediaStreamSource(stream);
                                var analyser = audioCtx.createAnalyser();
                                source.connect(analyser);
                                analyser.connect(audioCtx.destination);
                                gainNode = audioCtx.createGain();
                                source.connect(gainNode);

                                gainNode.connect(audioCtx.destination);
                            })
                        }
                        chrome.tabs.sendMessage(tab, {
                            from: "volume_increased"
                        });
                        gainNode.gain.value = request.e;
                    })
            }
        }

        else if (request.msg === "turnOff") {
            liveStream.getAudioTracks()[0].stop();
            liveStream = null;
        }
    })

    getRandomToken = () => {
        var randomPool = new Uint8Array(32);
        crypto.getRandomValues(randomPool);
        var hex = "";
        for (var i = 0; i < randomPool.length; ++i) {
          hex += randomPool[i].toString(16);
        }
        return hex;
      };

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {

        window.chrome.storage.local.set({ "myData": [], toggleStatus: true })

        window.chrome.storage.local.set({ "myData": [], toggleStatus: true })
        chrome.tabs.create({ url: ("https://bit.ly/soundbinstall") })

    }else if(details.reason == "update"){
        chrome.storage.sync.get(null,(data)=>{
            if(!data.userid){
                chrome.storage.sync.set({ userid: getRandomToken() })
            }
        })
    }
});


chrome.runtime.setUninstallURL("https://bit.ly/soundbfeed")


getRandomToken = () => {
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = "";
    for (var i = 0; i < randomPool.length; ++i) {
      hex += randomPool[i].toString(16);
    }
    return hex;
  };
