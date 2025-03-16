import Http from "../utils/http";

export interface CreateGroupParams {
    ownerId: number;
    groupName: string;
    memberIds?: number[];
}

export interface GroupChat {
    id: number;
    ownerId: number;
    groupName: string;
    members: any[]; //might refine
}

// create a new chat group via POST
export async function createGroup(params: CreateGroupParams): Promise<GroupChat> {
    return Http.post("/chat-group/create", params);
}

export interface GetGroupDetailsParams {
    groupId: number;
}

// fetch group details via POST
export async function getGroupDetails(params: GetGroupDetailsParams): Promise<GroupChat> {
    return Http.post("/chat-group/details", params);
}

export interface JoinGroupParams {
    groupId: number;
    userId: number;
}

// join an existing group via POST
async function joinGroup(params: JoinGroupParams): Promise<any> {
    return Http.post("/chat-group/join", params);
}

export default {
    createGroup,
    getGroupDetails,
    joinGroup,
};
