import { combineReducers } from 'redux';
import auth from './auth';
import common from './common';
import station from './station';
import story from './story';
import plugin from './plugin';

export default combineReducers({
    auth,
    common,
    station,
    story,
    plugin,
});