import { authTypes } from './types';

function reqLogin(loginData) {
    return {
        type: authTypes.REQUEST_LOGIN,
        loginData,
    }
}

function resLogin(loginData, json) {
    return {
        type: authTypes.RECEIVE_LOGIN,
        userData: {
            username: json.data.username,
        },
    }
}

function login(loginData) {
    return {
        type: authTypes.LOGIN,
        loginData,
    }
}

function register(registerData) {
    
}

function logout() {

}

const auth = {
    login,
    register,
    logout,
}

export {
    auth,
}