import { io } from "../modules/socket.io.esm.min.js";

//The low-level connection to the Socket.IO server can either be established with:
// HTTP long-polling: successive HTTP requests (POST for writing, GET for reading)
// WebSocket
// WebTransport
// 所以猜测在google extension中, 没有自己的http地址, 所以失败
// 连接到 Socket.IO 服务器

function connectToSocket() {
    const socket = io("http://localhost:3000", { transports: ["websocket"] });
    socket.emit("pluginConnection");
    socket.on("connect", () => {
        console.log("已连接到服务器");
        socket.emit("message", "Hello, Server!"); // 发送消息给服务器
    });

    // data包含url和fair integer number
    // data:{from, to, partner, number, url}
    socket.on("open a new tab", (data) => {
        chrome.tabs.create({ url: data.url }, function (newTab) {
            // 当标签页加载完成时触发
            chrome.tabs.onUpdated.addListener(async function onUpdatedListener(tabId, changeInfo, tab) {
                if (tabId === newTab.id && changeInfo.status === "complete") {
                    await openAndSimulate(tab, data.number);
                    // 移除事件监听器，因为它只需要在加载完成后执行一次
                    chrome.tabs.onUpdated.removeListener(onUpdatedListener);
                }
            });
        });
        console.log("a new tab has opened");
        let { from, to, partner, number, url } = data;
        // 通知请求者和合作者: 新标签已经打开
        socket.emit("new tab opening finished to applicant", { from: "plugin", to: from, number, url });
        socket.emit("new tab opening finished to pre relay", { from: "plugin", to: partner, number, url });
    });

    return socket;
}

// 断开与 Socket.IO 服务器的连接
function disconnectSocket(socket) {
    if (socket) {
        socket.disconnect();
    }
}

// Inject programmatically. 模拟文件上传
async function openAndSimulate(tab, fileNumber) {
    let fileName = `account/user account ${fileNumber}.txt`;

    try {
        const response = await fetch(chrome.runtime.getURL(fileName));
        const fileContent = await response.text();

        // 向content script发送消息，模拟上传, 在这里面运行的函数不能使用外部定义的变量
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: (fileContent, fileName) => {
                const fileInput = document.getElementById("privateKeyFile");
                if (fileInput) {
                    // 创建一个File对象，将文件内容设置为插件内部的文件内容
                    const file = new File([fileContent], fileName, { type: "text/plain" });

                    // 创建一个包含单个文件的FileList对象
                    const fileList = new DataTransfer();
                    fileList.items.add(file);

                    // 将FileList对象分配给input元素的files属性
                    fileInput.files = fileList.files;
                    const event = new Event("change", { bubbles: true });
                    fileInput.dispatchEvent(event);
                }
            },
            args: [fileContent, fileName],
        });
    } catch (error) {
        console.error("Error reading file or simulating upload:", error);
    }
}
export { connectToSocket, disconnectSocket };
