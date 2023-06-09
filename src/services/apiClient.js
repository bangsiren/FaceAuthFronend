import  { create } from 'apisauce';
import { getToken } from '../utils/storage';
const apiUrlTest  = 'http://localhost:5001';

const api =  create({
    baseURL: apiUrlTest,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
})

api.addAsyncRequestTransform(async (request) => {
   const authToken = getToken();
   if(!authToken) return;
   request.headers['token'] = authToken;
})

export default api;
