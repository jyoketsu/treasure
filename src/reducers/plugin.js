import {
    CREATE_PLUGIN,
    EDIT_PLUGIN,
    DELETE_PLUGIN,
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
        case EDIT_PLUGIN:
            if (!action.error) {
                let pluginList = JSON.parse(JSON.stringify(state.pluginList));
                for (let i = 0; i < pluginList.length; i++) {
                    if (pluginList[i]._key === action.pluginKey) {
                        pluginList[i] = action.payload.result;
                        break;
                    }
                }
                return {
                    ...state,
                    pluginList: pluginList,
                };
            } else {
                return state;
            }
        case DELETE_PLUGIN:
            if (!action.error) {
                let pluginList = JSON.parse(JSON.stringify(state.pluginList));
                for (let i = 0; i < pluginList.length; i++) {
                    if (pluginList[i]._key === action.pluginKey) {
                        pluginList.splice(i, 1);
                        break;
                    }
                }
                return {
                    ...state,
                    pluginList: pluginList,
                };
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
