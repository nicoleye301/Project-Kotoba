import Http from "../utils/http"

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

export default {
    uploadSettings,
    setPassword,
    uploadAvatar
};