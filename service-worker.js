console.log("extention load success");
// test：监听来自网页的消息
chrome.runtime.onMessageExternal.addListener(function (message, sender, sendResponse) {
    if (message.action === "test") {
        console.log(message);
        chrome.tabs.create({ url: message.url });
    }
});

// 监听模拟文件上传
chrome.runtime.onMessageExternal.addListener(function (message, sender, sendResponse) {
    var url = "http://127.0.0.1:5501/app/dist/fairIntegerSep.html";
    if (message.action === "startSimulatedUpload") {
        chrome.tabs.create({ url: message.url });
        console.log("simulate file upload");
    }
});

// Inject programmatically
function simulateFileUpload(message) {
    const fileInput = document.getElementById("privateKeyFile");
    if (fileInput) {
        // 创建一个File对象，将文件内容设置为插件内部的文件内容
        console.log(message.fileContent);
        const file = new File([message.fileContent], "example.txt", { type: "text/plain" });

        // 创建一个包含单个文件的FileList对象
        const fileList = new DataTransfer();
        fileList.items.add(file);

        // 将FileList对象分配给input元素的files属性
        fileInput.files = fileList.files;
        const event = new Event("change", { bubbles: true });
        fileInput.dispatchEvent(event);
    }
}

// 新页面加载完成时触发
chrome.webNavigation.onCompleted.addListener(function (details) {
    // 你可以在这里判断页面的URL是否匹配你的目标页面
    if (details.url.includes("127.0.0.1:5501/app")) {
        console.log("Page loaded:", details.url);
        fetch(chrome.runtime.getURL("account/user account 1.txt"))
            .then((response) => response.text())
            .then((fileContent) => {
                // 向content script发送消息，模拟上传
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    const activeTab = tabs[0];
                    chrome.scripting.executeScript({
                        target: { tabId: activeTab.id },
                        func: simulateFileUpload,
                        args: [{ action: "simulateFileUpload", fileContent }],
                    });
                });
            })
            .catch((error) => {
                console.error("Error reading or simulating upload:", error);
            });
    }
});
