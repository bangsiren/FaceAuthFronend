const key = "authToken";

const storeToken  =  (authToken) => {
    try {
        localStorage.setItem(key, authToken);
    } catch (error) {
        console.log("Error storing auth token", error)
    }
}

const getToken = () => {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.log("Error getting the auth token", error)
    }
}


const removeToken =  ()=> {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.log("Error removing auth token", error);
    }
}


export { getToken, removeToken, storeToken }

