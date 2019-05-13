import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { promiseMiddleware, localStorageMiddleware } from './middleware';
import rootReducer from './reducers/index';

const getMiddleware = () => {
  return applyMiddleware(promiseMiddleware, localStorageMiddleware);
}

const store = createStore(rootReducer, composeWithDevTools(getMiddleware()))

export default store;