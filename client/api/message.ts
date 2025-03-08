//placeholder impl

import Http from "../utils/http";

export interface SendMessageParams {
    message: string;
    // for one-to-one chat, use conversationId
    // for group chat, use groupId
    conversationId?: number;
    groupId?: number;
}

export interface Message {
    id: number;
    senderId: number;
    // either conversationId (one-to-one) or groupId (group chat)
    conversationId: number;
    content: string;
    timestamp: string;
    isGroup: boolean;
}

export async function fetchHistory({ conversationId, isGroup }: { conversationId: number; isGroup: boolean; }) {
    //temp placeholder for dummy testing
    return Promise.resolve([
        {
            id: 1,
            senderId: 2,
            conversationId,
            content: "Hello, this is a test message!",
            timestamp: new Date().toISOString(),
            isGroup,
        },
    ]);
}

//placeholder
export async function sendMessage(payload: any) {
    // testing
    const response = await Http.post('/message/send', payload);
    return response.data;
}

export default { fetchHistory, sendMessage };