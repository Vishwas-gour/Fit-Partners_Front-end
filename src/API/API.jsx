
import axios from 'axios';


const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "http://ec2-13-203-195-90.ap-south-1.compute.amazonaws.com:8080";

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
