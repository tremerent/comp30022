import axios from 'axios';

/**
 * Wrapper for axios. Invoke with token to receive the initialised instance (
 * or null if no token).
 */

const apiUrl = '/api'

function apiFetch() {
    const apiOpts = {
        baseURL: apiUrl,
        headers: {
            'Content-Type': 'application/json',
        }
    }

    const instance = axios.create(apiOpts);

    instance.interceptors.request.use(function (config) {
        const token = localStorage.getItem('token');
        config.headers.Authorization = token ? `Bearer ${token}` : '';
        return config;
    });

    return instance;
}

function apiFetchWithAuth(token) {
    const ax = apiFetch();

    if (token) {
        ax.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    return ax;
}

// given a token, returns an initialised axios instance
export default apiFetchWithAuth;

