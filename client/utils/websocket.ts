
import eventEmitter from "@/utils/eventEmitter";

const wsUrl = "ws://10.0.2.2:8080/ws";
let socket;

export function connect() {
    // create the WebSocket connection - connection establish immediately
    socket = new WebSocket(wsUrl);

    // called when connection is opened
    socket.onopen = function (event) {
        console.log("WebSocket is open now.");
    };

    // called when a message is received
    socket.onmessage = function (event) {
        console.log("Received:", event.data);
        // emit the message to event emitter so other parts of app can listen
        eventEmitter.emit("message", event.data);
    };

    // called when there is an error
    socket.onerror = function (event) {
        console.error("WebSocket error observed:", event);
    };

    // called when connection is closed
    socket.onclose = function (event) {
        console.log("WebSocket is closed now.");
    };
}

export function sendMessage(message) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    } else {
        console.error("WebSocket is not open. Ready state: ", socket.readyState);
    }
}

export default {
    connect,
    sendMessage,
};
