import api from './services/Api';
import { message } from 'antd';

import {
    ASYNC_START,
    ASYNC_END,
    LOGIN,
    LOGOUT,
    REGISTER,
}
    from './actions/app';

const promiseMiddleware = store => next => action => {
    if (isPromise(action.payload)) {
        store.dispatch({ type: ASYNC_START, flag: action.flag, noLoading: action.noLoading, subtype: action.type });

        const currentView = store.getState().viewChangeCounter;
        const skipTracking = action.skipTracking;

        action.payload.then(
            res => {
                const currentState = store.getState();
                if (!skipTracking && currentState.viewChangeCounter !== currentView) {
                    return;
                }
                if (parseInt(res.statusCode, 10) === 200) {
                    action.payload = res;
                    store.dispatch({ type: ASYNC_END, flag: action.flag, promise: action.payload });
                    store.dispatch(action);
                }
                else {
                    action.error = true;
                    action.payload = res;
                    if (res.statusCode !== "701") {
                        message.error(res.msg);
                    } else {
                        window.location.href = `/account/login${window.location.search}`;
                    }
                    store.dispatch({ type: ASYNC_END });
                    store.dispatch(action);
                }
            },
        );
        return;
    }

    next(action);
};

const localStorageMiddleware = store => next => action => {
    if (action.type === LOGIN) {
        if (!action.error) {
            window.localStorage.setItem('TOKEN', action.payload.token);
            api.setToken(action.payload.token);
        }
    } else if (action.type === REGISTER) {
        if (!action.error) {
            window.localStorage.setItem('TOKEN', action.payload.data.token);
            api.setToken(action.payload.data.token);
        }
    }
    else if (action.type === LOGOUT) {
        window.sessionStorage.clear();
        window.localStorage.clear();
        api.setToken('');
    }

    next(action);
};

function isPromise(v) {
    return v && typeof v.then === 'function';
}


export { promiseMiddleware, localStorageMiddleware };