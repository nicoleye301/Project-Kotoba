import Http from "../utils/http";

function register(param:{}) {
    return Http.post("/user/register", param);
}

export default {register}