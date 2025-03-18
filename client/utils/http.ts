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
        instance.post(url, param, config).catch(error => {
            if (error.response) {
                console.error('Server error:', error.response);
            } else if (error.request) {
                console.error('No response:', error.request);
            } else {
                console.error('Request error:', error.message);
            }
        })
    }
    else{
        const response = await instance.post(url, param);
        return response.data;
    }
};

export default { get, post };
