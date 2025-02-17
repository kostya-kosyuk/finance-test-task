import { isIdinLocalStorage, removeIdFromLocalStorage, addTickerIdToLocalStorage} from '../utils/tickersLocalStorage';

const initialState = {
    quotes: [],
};

export const quotesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_QUOTES':  {
            const updatedQuotes = action.payload.map((newQuote) => {
                const oldQuote = state.quotes.find(quote => quote.id === newQuote.id);
                return oldQuote ? {...oldQuote, ...newQuote } : {...newQuote, isTracked: isIdinLocalStorage(newQuote.id)};
            });

            const oldQuotes = state.quotes.filter((oldQuote) => !updatedQuotes.find(newQuote => newQuote.id === oldQuote.id));

            return {
                ...state,
                quotes: [...updatedQuotes, ...oldQuotes]
            };
        }
        case 'TOGGLE_QUOTE_TRACKING': {
            const id = action.payload;
            const quoteIndex = state.quotes.findIndex(quote => quote.id === id);

            if (quoteIndex === -1) {
                return state;
            };

            const updatedQuotes = [...state.quotes];
            const quoteByIndex = updatedQuotes[quoteIndex];
            quoteByIndex.isTracked = !quoteByIndex.isTracked;

            if (quoteByIndex.isTracked) {
                addTickerIdToLocalStorage(id);
            } else {
                removeIdFromLocalStorage(id);
            }

            return {
                ...state,
                quotes: updatedQuotes,
            };
        }
        default:
            return state;
    }
};