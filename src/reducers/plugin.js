import {
    CREATE_PLUGIN,
    GET_PLUGIN_LIST,
    CLEAR_PLUGIN_LIST
} from '../actions/app';
import { message, } from 'antd';

const defaultState = {
    pluginList: []
};

const plugin = (state = defaultState, action) => {
    switch (action.type) {
        case CREATE_PLUGIN:
            if (!action.error) {
                message.success('创建成功！');
                return {
                    ...state,
                }
            } else {
                return state;
            }
        case GET_PLUGIN_LIST:
            if (!action.error) {
                return {
                    ...state,
                    pluginList: action.payload.result,
                }
            } else {
                return state;
            }
        case CLEAR_PLUGIN_LIST:
            return {
                ...state,
                pluginList: [],
            }
        default:
            return state;
    }
};

export default plugin;
