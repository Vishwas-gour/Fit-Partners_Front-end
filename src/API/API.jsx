import axios from 'axios';

// Environment URLs
const ENV = {
  local: "http://localhost:8080",
  railway: "https://fit-partners-backend.up.railway.app",
  aws: "https://FitPartner-env.eba-kxssumfj.ap-south-1.elasticbeanstalk.com"
};

// Determine BASE_URL dynamically
let BASE_URL;

if (window.location.hostname === "localhost") {
  BASE_URL = ENV.local;
} else if (window.location.hostname.includes("railway.app")) {
  BASE_URL = ENV.railway;
} else {
  BASE_URL = ENV.aws;
}

// Create Axios instance
const API = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor to add Authorization header
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
