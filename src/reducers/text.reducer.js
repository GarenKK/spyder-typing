import { textConstants } from '../constants';

export function text(state = {}, action) {
  switch (action.type) {
    case textConstants.TEXT_REQUEST:
      return {
        loading: true
      };
    case textConstants.TEXT_SUCCESS:
      return {
        random: action.text
      };
    case textConstants.TEXT_FAILURE:
      return { 
        error: action.error
      };
    default:
      return state
  }
}