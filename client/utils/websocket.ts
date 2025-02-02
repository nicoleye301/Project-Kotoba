const wsUrl = "ws://10.0.0.2:8080/ws";  //backend url

let socket: WebSocket | null = null;

export function connectWebSocket(onMessage: (message: string) => void) {
    socket = new WebSocket(wsUrl);

    socket.onopen = () => console.log("✅ WebSocket 连接成功");
    socket.onmessage = (event) => onMessage(event.data);
    socket.onclose = () => console.log("❌ WebSocket 连接关闭");
    socket.onerror = (error) => console.error("⚠️ WebSocket 错误:", error);
}

export function sendMessage(message: string) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    } else {
        console.warn("⚠️ WebSocket 未连接");
    }
}
