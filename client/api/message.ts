import Http from "@/utils/http"

function sendMessage(message:string){
    Http.post("/message/send",{message:message})
}

export default {sendMessage}