import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Aapka Laravel backend URL
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// // Request Interceptor: Har request se pehle localStorage se token utha kar Authorization header me daalega
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

api.interceptors.request.use((config) => {
    // 1. Pehle check karein kya is specific tab ke sessionStorage mein koi token hai? (Impersonation check)
    let token = sessionStorage.getItem('token');
    
    // 2. Agar tab-specific token nahi hai, to default localStorage wala token uthain
    if (!token) {
        token = localStorage.getItem('token');
    }
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;