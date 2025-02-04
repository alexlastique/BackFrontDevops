import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:5000",
    mode: 'no-cors',
    headers: {
        accept: "application/json",
        "Content-Type": "application/json",
    },
});

export default axiosInstance;