// Extension service workers are an extension's central event handler.
// 用于处理各种事件
import { connectToSocket, disconnectSocket } from "./connector.js";

let socket = null;
console.log("extention load success");

// this is a test：监听来自网页的消息
chrome.runtime.onMessageExternal.addListener(function (message, sender, sendResponse) {
    if (message.action === "test") {
        console.log(message);
        chrome.tabs.create({ url: message.url });
    }
});

// popup将消息发送给service worker, 打开或者关闭socket
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggleSocket") {
        const socketStatus = message.status;
        if (socketStatus) {
            socket = connectToSocket();
            console.log("Socket.IO connected");
        } else {
            socket = disconnectSocket();
            console.log("Socket.IO disconnected");
        }
        // 可以向popup发送响应
        sendResponse({ message: "Socket status updated" });
    }
});

// deprecated. 之前是: 收到网页的信息, service worker会打开一个新页面.
//             现在是: 收到服务器的socket, 打开一个新页面.
chrome.runtime.onMessageExternal.addListener(function (message, sender, sendResponse) {
    var url = "http://127.0.0.1:5501/app/dist/fairIntegerSep.html";
    if (message.action === "startSimulatedUpload") {
        chrome.tabs.create({ url: message.url });
        console.log("simulate file upload");
    }
});
