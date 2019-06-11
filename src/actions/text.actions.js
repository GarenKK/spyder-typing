import { apiService } from '../services';
import { textConstants } from '../constants';

export function getText() {
    return dispatch => {
        dispatch(request());
        apiService.getText().then(
            data => dispatch(success(data)),
            error => dispatch(failure(error.toString()))
        );
    };
}

function request() {
  	return { type: textConstants.TEXT_REQUEST };
}

function success(text) {
  	return { type: textConstants.TEXT_SUCCESS, text };
}

function failure(error) {
  	return { type: textConstants.TEXT_FAILURE, error };
}