import axios from "axios";
import { Platform } from 'react-native';

const api = axios.create({
    baseURL: Platform.OS === 'ios'
    ? 'http://172.20.10.7:5216/'
    : 'http://10.0.2.2:5216/'
    
});

export default api;