import Http from "@/utils/http";

async function getStreaks(userId: string) {
    return await Http.get(`/user/getStreaks?userId=${userId}`);
}

export default {getStreaks}