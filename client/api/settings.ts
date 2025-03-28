import Http from "../utils/http"
import {User} from "@/api/user";

async function uploadSettings(params: {}) {
    return Http.post("/user/uploadSettings", params)
}

async function setPassword(params: {}) {
    return Http.post("/user/setPassword", params)
}

async function uploadAvatar(data: FormData) {
    return Http.post("/user/uploadAvatar", data,
        {headers: {'Content-Type': 'multipart/form-data'}}
    )
}

async function getSettings(userId:number): Promise<string> {
    return Http.get(`/user/getSettings?userId=${userId}`);
}

export default {
    uploadSettings,
    getSettings,
    setPassword,
    uploadAvatar
};