import React, { useEffect, useMemo, useCallback } from "react";
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { getRows } from '../helpers/getRows';
import TickerList from "./TickerList";
import { setQuotes } from "../store/quotesActions";
import { setSocket, setSocketInterval, socketConnected, socketDisconnected } from '../store/socketAction';

const Data = () => {
    const dispatch = useDispatch();
    const quotes = useSelector(state => state.quotes.quotes);

    const trackedQuotesRows = useMemo(() => quotes
        ? getRows(quotes.filter(({isTracked}) => isTracked))
        : [],
    [quotes]);
    const untrackedQuotesRows = useMemo(() => quotes
        ? getRows(quotes.filter(({ isTracked }) => !isTracked))
        : getRows(quotes),
    [quotes]);

    const handleQuotesUpdate = useCallback((quotes) => dispatch(setQuotes(quotes)), []);

    useEffect(() => {
        const socket = io('http://localhost:4000');

        socket.on('connect', () => {
            dispatch(socketConnected(true));
        });

        socket.on('ticker', (quotes) => {
            handleQuotesUpdate(quotes);
        });

        socket.on('disconnect', () => {
            dispatch(socketDisconnected(false));
        });

        dispatch(setSocket(socket));

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
            <>
            {quotes
                ? (<>
                    <TickerList
                        title={'Your tickers'}
                        rows={trackedQuotesRows}
                    />
                    <TickerList
                        title={'All tickers'}
                        rows={untrackedQuotesRows}
                    />
                </>)
                : 'Loading...'}
            </>
    );
}

export default Data;

