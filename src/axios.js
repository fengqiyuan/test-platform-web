import axios from 'axios'
import useUserStore from './store/user';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  timeout: 5000,
});

http.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    config.headers.Authorization = `Bearer ${userStore.access_token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const userStore = useUserStore()   
      if (error.response.status === 401) {
        // Redirect to login page
        userStore.clearUser()
        window.location.href = "/login";
      }
    } else if (error.request) {
      console.error(error.request);
    } else {
      console.error('Error', error.message);
    }
    return Promise.reject(error);
  }
);

export default http;
