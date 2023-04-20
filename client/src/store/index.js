import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux'
import thunk from 'redux-thunk';
import { quotesReducer } from './quotesReducer';

const rootReducer = combineReducers({
    quotes: quotesReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunk));