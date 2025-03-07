import Http from "../utils/http";

export interface LoginParams {
    username: string;
    password: string;
}

export interface LoginResponse {
    userId: number;
    username: string;
    token: string;
    portrait: string;
}

async function login(params: LoginParams): Promise<LoginResponse> {
    return Http.post("/user/login", params);
}

export default {
    login,
};
