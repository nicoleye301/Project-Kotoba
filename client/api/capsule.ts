import Http from "@/utils/http";

export interface Capsule {
    id: number;
    creatorId: number;
    targetUserId: number;
    message: string;
    unlockTime: string;
    createdAt: string;
    isUnlocked: boolean;
    unlockedAt?: string;
}

/**
 * Schedule a new capsule.
 */
export async function createCapsule(params: {
    creatorId: number;
    targetUserId: number;
    message: string;
    unlockTime: string;
}): Promise<Capsule> {
    return await Http.post("/api/capsules", params);
}

/**
 * list all capsules you’ve created
 */
export async function fetchByCreator(creatorId: number): Promise<Capsule[]> {
    return await Http.get(`/api/capsules/creator/${creatorId}`);
}

/**
 * fetch (and unlock) any capsules whose time has come for you
 */
export async function fetchReady(targetUserId: number): Promise<Capsule[]> {
    return await Http.get(`/api/capsules/unlock/${targetUserId}`);
}

/**
 * lookup a single capsule by its ID
 */
export async function fetchById(id: number): Promise<Capsule> {
    return await Http.get(`/api/capsules/${id}`);
}

export default {
    createCapsule,
    fetchByCreator,
    fetchReady,
    fetchById,
};
