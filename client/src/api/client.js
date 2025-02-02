import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';


const testConnection = async () => {   // Lisa test endpoint
    try {
        const response = await axios.get(`${API_BASE_URL}/test`);
        console.log('API Connection Test:', response.data);
        return true;
    } catch (error) {
        console.error('API Connection Error:', error);
        return false;
    }
};

const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

client.interceptors.request.use(request => {
    console.log('Väljuv päring:', request);
    return request;
});

client.interceptors.response.use(response => {
    console.log('Saabuv vastus:', response);
    return response;
});

export { testConnection }; // Ekspordib test funktsiooni 
export default client; 