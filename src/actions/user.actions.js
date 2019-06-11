import { userConstants } from '../constants';
import { apiService } from '../services';
import { alertActions } from './';
import { history } from '../helpers';

export const userActions = {
    login,
    logout,
    register,
    getData,
    saveData
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        apiService.login(username, password)
            .then(
                user => { 
                    dispatch(success(user));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    apiService.logout();
    return { type: userConstants.LOGOUT };
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        apiService.register(user)
            .then(
                user => { 
                    dispatch(success());
                    history.push('/login');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function getData(id) {
    return dispatch => {
        dispatch(request(id));
        apiService.getData(id)
            .then(
                data => dispatch(success(data)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(id) { return { type: userConstants.GET_USER_DATA_REQUEST, id } }
    function success(data) { return { type: userConstants.GET_USER_DATA_SUCCESS, data } }
    function failure(error) { return { type: userConstants.GET_USER_DATA_FAILURE, error } }
}

function saveData(id, data) {
    return dispatch => {
        dispatch(request(id));
        apiService.saveData(id, data)
            .then(
                data => dispatch(success()),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(id) { return { type: userConstants.SAVE_USER_DATA_REQUEST, id } }
    function success() { return { type: userConstants.SAVE_USER_DATA_SUCCESS } }
    function failure(error) { return { type: userConstants.SAVE_USER_DATA_FAILURE, error } }
}
