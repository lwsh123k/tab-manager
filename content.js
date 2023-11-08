// content_script.js
// 用于读取和修改页面中的内容, 如: 添加或者去除某个element
// 每当页面匹配上了就会加载

// not used
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "simulateFileUpload") {
        const fileInput = document.getElementById("privateKeyFile");
        if (fileInput) {
            // 创建一个File对象，将文件内容设置为插件内部的文件内容
            const file = new File([message.fileContent], "example.txt", { type: "text/plain" });

            // 触发change事件，模拟用户选择了文件
            const event = new Event("change", { bubbles: true });
            fileInput.files = [file];
            fileInput.dispatchEvent(event);
        }
    }
});
