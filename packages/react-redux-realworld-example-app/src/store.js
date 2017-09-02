import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { promiseMiddleware, localStorageMiddleware } from './middleware';
import reducer from './reducer';
import initialState from './initial-state.json';

const getMiddleware = () => applyMiddleware(promiseMiddleware, localStorageMiddleware);

const store = createStore(reducer, initialState, composeWithDevTools(getMiddleware()));

export default store;
