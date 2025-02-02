import Http from "../utils/http";

function login(param:{}) {
    return Http.post("/user/login", param);
}

export default {login}