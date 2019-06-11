import config from 'config';
import { authHeader } from '../helpers';

const TEXT_URL = "https://baconipsum.com/api/?type=meat-and-filler&sentences=6";
export const apiService = {
    login,
    logout,
    register,
    getData,
    saveData,
    getText
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getData(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${config.apiUrl}/user/${id}`, requestOptions).then(handleResponse);
}

function saveData(id, data) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    return fetch(`${config.apiUrl}/user/${id}`, requestOptions).then(handleResponse);
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/users/register`, requestOptions).then(handleResponse);
}

function getText() {
    const requestOptions = { method: 'GET' };
    return fetch(TEXT_URL, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}