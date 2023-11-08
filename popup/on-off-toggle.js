// 获取开关元素和状态显示元素
const toggleSwitch = document.getElementById("toggleSwitch");
const statusText = document.getElementById("status");

// 初始状态为"Off"
statusText.textContent = "Off";

// 监听开关的状态变化
toggleSwitch.addEventListener("change", function () {
    // 切换状态
    if (toggleSwitch.checked) statusText.textContent = "On";
    else statusText.textContent = "Off";

    // 通知 Service Worker 打开或者关闭socket
    let status = statusText.textContent === "On" ? true : false;
    chrome.runtime.sendMessage({ action: "toggleSocket", status: status }, (response) => {
        // 可以在这里处理来自Service Worker的响应
        console.log("Message sent to Service Worker");
    });
});
