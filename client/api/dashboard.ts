import Http from "@/utils/http";

interface Streak {
    groupName: string
    streak: string
}

interface Milestone{
    friendName: string
    updated: boolean    // when we pass a milestone
    congrats: boolean   // (only when updated is true) if this milestone has been achieved
    progress: number    // achieved milestones
    repeat: number  // total number of milestones
}


async function getStreaks(userId: string):Promise<Streak[]> {
    return await Http.get(`/user/getStreaks?userId=${userId}`);
}

async function getMilestones(userId: string):Promise<Milestone[]> {
    return await Http.get(`/user/getMilestones?userId=${userId}`);
}

export interface OneToOneFrequency {
    friendName: string;
    count: number;
}

async function getOneToOneFrequency(userId: string): Promise<OneToOneFrequency[]> {
    return Http.get(`/user/getOneToOneFrequency?userId=${userId}`);
}

export default {getStreaks, getMilestones, getOneToOneFrequency}