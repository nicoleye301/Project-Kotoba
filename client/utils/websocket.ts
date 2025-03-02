import eventEmitter from "@/utils/eventEmitter";

const wsUrl = "ws://10.0.2.2:8080/ws";  //backend url
let socket: WebSocket

export function connectWebSocket(){
    if(socket){
        socket.close()
    }
    socket = new WebSocket(wsUrl)
    socket.onopen = () => console.log("websocket connected");
    socket.onmessage = (event) => {
        eventEmitter.emit('message',event.data)
    };
    socket.onclose = () => console.log("websocket closed");
    socket.onerror = (error) => console.error(error);
}

function sendMessage(message: string) {
    socket.send(message);
}

export default {sendMessage}
