import { combineReducers } from 'redux';
import auth from './auth';
import common from './common';
import station from './station';
import story from './story';

export default combineReducers({
    auth,
    common,
    station,
    story,
});