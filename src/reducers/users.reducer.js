import { userConstants } from '../constants';

export function userData(state = {}, action) {
  switch (action.type) {
    case userConstants.GET_USER_DATA_REQUEST:
      return {
        loading: true
      };
    case userConstants.GET_USER_DATA_SUCCESS:
      return {
        stats: action.data
      };
    case userConstants.GET_USER_DATA_FAILURE:
      return {
        error: action.error
      };
    case userConstants.SAVE_USER_DATA_REQUEST:
      return {
        loading: true
      };
    case userConstants.SAVE_USER_DATA_SUCCESS:
      return {};
    case userConstants.SAVE_USER_DATA_FAILURE:
      return { 
        error: action.error
      };
    default:
      return state;
  }
}