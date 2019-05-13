import { combineReducers } from 'redux';
import auth from './auth';
import common from './common';
import home from './home';

export default combineReducers({
    auth,
    common,
    home,
});