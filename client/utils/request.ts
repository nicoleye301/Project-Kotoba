import axios from "axios";


const request = axios.create({
    baseURL: 'http://10.0.2.2:8080', // for android emulator to visit computer ports
    timeout: 5000,
    headers: {'Content-Type': 'application/json'}
})

export default request