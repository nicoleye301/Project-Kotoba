import Http from "@/utils/http";

export interface SendMessageParams {
    senderId: number;
    groupId: number; // server expects groupId
    content: string;
    type: string
}

export interface Message {
    id: number;
    senderId: number;
    chatId: number;   // our mapped field (from server's group_id)
    content: string;
    sentTime: string; // mapped from server's sent_time
    status?: string;
    type: string;
}

export interface FetchHistoryOptions {
    before?: string;
    limit?: number;
}

// fetch conversation history and map server response to our Message type
export async function fetchHistory(chatId: number): Promise<Message[]> {
    const messages = await Http.get(`/message/history?chatId=${chatId}`);
    return messages.map((msg: any) => ({
        id: msg.id,
        senderId: msg.senderId,
        chatId: msg.groupId,
        content: msg.content,
        sentTime: msg.sentTime,
        status: msg.status,
        type: msg.type,
    }));
}

// send a message and map the response
export async function sendMessage(params: SendMessageParams): Promise<Message> {
    const msg = await Http.post("/message/send", params);
    return {
        id: msg.id,
        senderId: msg.senderId,
        chatId: msg.groupId,
        content: msg.content,
        sentTime: msg.sentTime,
        status: msg.status,
        type: msg.type,
    };
}

async function sendImage(data: FormData) {
    return await Http.post("/message/sendImage", data,
        {headers: {'Content-Type': 'multipart/form-data'}}
    )
}

export default { fetchHistory, sendMessage, sendImage };
