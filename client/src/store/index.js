import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux'
import thunk from 'redux-thunk';
import { quotesReducer } from './quotesReducer';
import { socketReducer } from './socketReducer';

const rootReducer = combineReducers({
    quotes: quotesReducer,
    socket: socketReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));