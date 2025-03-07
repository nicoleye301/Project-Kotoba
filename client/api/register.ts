import Http from "../utils/http";

export interface RegisterParams {
    username: string;
    account: string;
    password: string;
    email?: string;
    code?: string;
}


async function register(params: RegisterParams) {
    return Http.post("/user/register", params);
}

export default {
    register,
};
