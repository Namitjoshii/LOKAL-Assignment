import axios from 'axios';

const API = axios.create({
    baseURL: "https://saavn.sumit.co/api",
});

export default API;
