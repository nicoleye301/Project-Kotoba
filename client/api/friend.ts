import Http from "@/utils/http";

export interface FriendRequestParams {
    userId?: number;
    friendId?: number;
    friendUsername?: string;
}

// send a friend request
export function sendFriendRequest(params: FriendRequestParams) {
    return Http.post("/friend/request", params);
}

// accept a friend request
export function acceptFriendRequest(params: {}) {
    return Http.post("/friend/accept", params);
}

// decline a friend request
export function declineFriendRequest(params: {}) {
    return Http.post("/friend/decline", params);
}

// get list of accepted friends for a given user
export function getFriendList(userId: number) {
    console.log("Fetching friend list for userId:", userId);
    return Http.get(`/friend/list?userId=${userId}`);
}

// get list of pending friend requests for a given user
export function getPendingRequests(userId: number) {
    console.log("Fetching pending requests for userId:", userId);
    return Http.get(`/friend/pending?userId=${userId}`);
}

// remove a friend
export function removeFriend(params: FriendRequestParams) {
    return Http.post("/friend/remove", params);
}

//set a milestone for a friend
export async function setMilestone(params: {
    currentUserId: number;
    friendId: number;
    milestoneSettings: string;
}): Promise<any> {
    return Http.post("/friend/setMilestone", params);
}

// get friend profile data
export function getFriendProfile(userId: number, friendId: number) {
    return Http.get(`/friend/profile?userId=${userId}&friendId=${friendId}`);
}

// set nickname
export async function setNickname(params: {
    userId: number;
    friendId: number;
    nickname: string;
}): Promise<any> {
    return Http.post("/friend/setNickname", params);
}

export default {
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    getFriendList,
    getPendingRequests,
    removeFriend,
    setMilestone,
    getFriendProfile,
    setNickname
};
