import axios from "axios";

const request = axios.create({
    baseURL: 'http://Localhost:8080',
    timeout: 30000
})
export default request