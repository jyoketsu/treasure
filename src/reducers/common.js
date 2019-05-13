import {
    ASYNC_START, ASYNC_END,
} from '../actions/app';

const defaultState = {
    loading: false,
    waiting: false,
};

const common = (state = defaultState, action) => {
    switch (action.type) {
        case ASYNC_START:
            return {
                ...state,
                loading: action.noLoading ? false : true,
                waiting: true,
            };
        case ASYNC_END:
            return {
                ...state,
                loading: false,
                waiting: false,
            };
        default:
            return state;
    }
};

export default common;
