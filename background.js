var msg = { name: "", titles: [], time: [], status: "wait" };
set();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    msg = message;
    sendResponse("Thank you");
    set();
});

function set() {
    chrome.storage.local.set({ key: msg }, function() {
        console.log(["BG Value Set:", msg]);
    });
}