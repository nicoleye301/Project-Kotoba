import axios from "axios";

const instance = axios.create({
    baseURL: "http://10.0.2.2:8080",
    timeout: 5000,
    headers: { "Content-Type": "application/json" },
});

const get = async (url: string) => {
    const response = await instance.get(url);
    return response.data;
};

const post = async (url: string, param: {}|FormData, config?:{}) => {
    if (config){
        const response = await instance.post(url, param, config)
        return response.data
    }
    else{
        const response = await instance.post(url, param);
        return response.data;
    }
};

export default { get, post };
