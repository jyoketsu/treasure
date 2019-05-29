import {
    ASYNC_START, ASYNC_END,
} from '../actions/app';

const defaultState = {
    loading: false,
    waiting: false,
    flag: '',
};

const common = (state = defaultState, action) => {
    switch (action.type) {
        case ASYNC_START:
            return {
                ...state,
                loading: action.noLoading ? false : true,
                waiting: true,
                flag: '',
            };
        case ASYNC_END:
            return {
                ...state,
                loading: false,
                waiting: false,
                flag: action.flag,
            };
        default:
            return state;
    }
};

export default common;
