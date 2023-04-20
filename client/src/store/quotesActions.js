export const setQuotes = (quotes) => ({
    type: 'SET_QUOTES',
    payload: quotes,
});

export const toggleQuoteTracking = (id) => ({
    type: 'TOGGLE_QUOTE_TRACKING',
    payload: id,
});