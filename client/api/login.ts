import Http from "../utils/http";

//todo
export interface LoginParams {
    username: string;
    password: string;
}

export interface LoginResponse {
    id: number;
    username: string;
}

async function login(params: LoginParams): Promise<LoginResponse> {
    return Http.post("/user/login", params);
}

export default {
    login,
};
