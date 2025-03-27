import Http from "@/utils/http";

export interface CreateGroupParams {
    ownerId: number;
    groupName: string;
    memberIds?: number[];
}

export interface ChatGroup {
    id: number;
    ownerId: number;
    groupName: string;
    // additional fields  returned by API (e.g., lastUpdateTime, muted, etc.) - will add later
}

export async function createGroup(params: CreateGroupParams): Promise<ChatGroup> {
    return Http.post("/chat-group/create", params);
}

export interface GetGroupDetailsParams {
    groupId: number;
}

// fetch group details via POST
export async function getGroupDetails(params: GetGroupDetailsParams): Promise<ChatGroup> {
    return Http.post("/chat-group/details", params);
}

export interface JoinGroupParams {
    groupId: number;
    userId: number;
}

// join an existing group via POST
export async function joinGroup(params: JoinGroupParams): Promise<any> {
    return await Http.post("/chat-group/join", params);
}

// fetch group chats for a user
export async function getGroupChats(userId: number): Promise<ChatGroup[]> {
    return await Http.get(`/chat-group/list?userId=${userId}`);
}

async function getAvatars(groupId:number){
    return await Http.get(`/chat-group/getAvatars?chatId=${groupId}`);
}

export default { createGroup, getGroupDetails, joinGroup, getGroupChats, getAvatars };
