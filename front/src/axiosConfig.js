import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000",
    mode: 'no-cors',
    headers: {
        accept: "application/json",
        "Content-Type": "application/json",
    },
});

export default axiosInstance;