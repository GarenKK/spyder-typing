import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { userData } from './users.reducer';
import { alert } from './alert.reducer';
import { text } from './text.reducer';

const rootReducer = combineReducers({
  authentication,
  registration,
  userData,
  alert,
  text
});

export default rootReducer;