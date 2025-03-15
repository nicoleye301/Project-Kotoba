import Http from "@/utils/http";

export interface User {
    id: number;
    username: string;
    avatar?: string;
}

export async function getUserById(userId: number): Promise<User> {
    return Http.get(`/user/details?userId=${userId}`);
}

export default { getUserById };