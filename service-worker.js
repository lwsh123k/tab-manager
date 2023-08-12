console.log("加载成功了");
// 监听来自网页的消息
//
chrome.runtime.onMessageExternal.addListener(function (message, sender, sendResponse) {
    console.log(message);
    if (message.url === blocklistedWebsite) return; // don't allow this web page access
    if (request.openUrlInEditor) openUrl(request.openUrlInEditor);
});
