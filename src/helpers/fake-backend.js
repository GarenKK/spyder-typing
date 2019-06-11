import axios from 'axios';

const JSON_URL = "https://api.myjson.com/bins";
const STORAGE_ID = "/112fd1";
const DEFAULT_DATA = {
    played: 0,
    history: [],
    avg: {
        score: 0,
        wpm: 0
    },
    best: {
        score: 0,
        wpm: 0
    }
};
    
export function configureFakeBackend() {
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            // authenticate
            if (url.endsWith('/users/authenticate') && opts.method === 'POST') {
                let params = JSON.parse(opts.body);
                // get all users
                axios.get(JSON_URL + STORAGE_ID).then(response => {
                    let users = response.data;
                    // find if any user matches login credentials
                    let filteredUsers = users.filter(user => {
                        return user.username === params.username && user.password === params.password;
                    });

                    if (filteredUsers.length) {
                        // if login details are valid return user details and fake jwt token
                        let user = filteredUsers[0];
                        let responseJson = {
                            id: user.id,
                            username: user.username,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            token: 'fake-jwt-token'
                        };
                        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(responseJson)) });
                    } else {
                        // else return error
                        reject('Username or password is incorrect');
                    }
                }).catch(error => {
                    reject(error);
                });
                return;
            }

            // get user data
            if (url.match(/\/user\/\w+$/) && opts.method === 'GET') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {
                    let id = url.split("/").pop();
                    axios.get(JSON_URL + "/" + id).then(response => {// respond 200 OK with user
                        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(response.data))});
                    }).catch(error => {
                        reject(error);
                    });
                } else {
                    // return 401 not authorised if token is null or invalid
                    reject('Unauthorised');
                }
                return;
            }
            // update user data
            if (url.match(/\/user\/\w+$/) && opts.method === 'PUT') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {
                    let id = url.split("/").pop();
                    axios.put(JSON_URL + "/" + id, JSON.parse(opts.body)).then(response => {// respond 200 OK with user
                        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(response.data))});
                    }).catch(error => {
                        reject(error);
                    });
                } else {
                    // return 401 not authorised if token is null or invalid
                    reject('Unauthorised');
                }
                return;
            }

            // register user
            if (url.endsWith('/users/register') && opts.method === 'POST') {
                let newUser = JSON.parse(opts.body);
                // get all users
                axios.get(JSON_URL + STORAGE_ID).then(response => {
                    let users = response.data;
                    // validation
                    let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
                    if (duplicateUser) {
                        reject('Username "' + newUser.username + '" is already taken');
                        return;
                    }
                    // create JSON storage id
                    axios.post(JSON_URL, Object.assign({id: newUser.username}, DEFAULT_DATA)).then(function (response) {
                        // save new user
                        newUser.id = response.data.uri.split("/").pop();
                        users.push(newUser);
                        axios.put(JSON_URL + STORAGE_ID, users).then(function (response) {
                            // respond 200 OK
                            resolve({ ok: true, text: () => Promise.resolve() });
                        }).catch(function (error) {
                            reject(error);
                        });
                    }).catch(function (error) {
                        reject(error);
                    });
                }).catch(error => {
                    reject(error);
                });
                return;
            }

            // pass through any requests not handled above
            realFetch(url, opts).then(response => resolve(response));
        });
    }
}