import eventEmitter from "@/utils/eventEmitter";

const wsUrl = "ws://169.226.60.158:8080/ws";
let socket: WebSocket | null = null;

export function connectWebSocket(): WebSocket {

    if (socket &&
        (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)
    ) {
        console.log("WebSocket already connected or connecting.");
        return socket;
    }

    // create the WebSocket connection - connection establish immediately
    socket = new WebSocket(wsUrl);

    // called when connection is opened
    socket.onopen = function (event: Event) {
        console.log("WebSocket is open now.");
    };

    // called when a message is received
    socket.onmessage = function (event : MessageEvent) {
        console.log("Received:", event.data);
        // emit the message to event emitter so other parts of app can listen
        eventEmitter.emit("message", event.data);
    };

    // called when there is an error
    socket.onerror = function (event: Event) {
        console.error("WebSocket error observed:", event);
    };

    // called when connection is closed
    socket.onclose = function (event) {
        console.log("WebSocket is closed now.");
        socket = null;
    };
    return socket;
}

//close websocket connection if exist
export function closeWebSocket(): void {
    if (socket) {
        console.log("Closing WebSocket connection.");
        socket.close();
        socket = null;
    }
}

export default {
    connectWebSocket,
};
