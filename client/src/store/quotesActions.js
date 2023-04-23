const SET_QUOTES = 'SET_QUOTES';
const TOGGLE_QUOTE_TRACKING = 'TOGGLE_QUOTE_TRACKING';

export const setQuotes = (quotes) => ({
    type: SET_QUOTES,
    payload: quotes,
});

export const toggleQuoteTracking = (id) => ({
    type: TOGGLE_QUOTE_TRACKING,
    payload: id,
});