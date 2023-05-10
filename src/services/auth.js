import api from "./apiClient";

const signUp = (name, data) => {
    api.setHeader('username', name);
    return api.post('/api/register', data);
}


const signIn = (data) => {
    return api.post('/api/verify', data);
}

export {
    signUp,
    signIn
}

