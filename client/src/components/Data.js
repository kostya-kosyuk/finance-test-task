import React, { useEffect, useMemo, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import io from 'socket.io-client';
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { getRows } from '../helpers/getRows';
import TickerList from "./TickerList";

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

    const handleQuotesUpdate = useCallback((quotes) => dispatch({
        type: 'SET_QUOTES',
        payload: quotes
    }), []);





    useEffect(() => {
        const socket = io('http://localhost:4000');

        socket.on('connect', () => {
            socket.emit('start');
        });

        socket.on('ticker', (quotes) => {
            handleQuotesUpdate(quotes);
        });

        socket.on('disconnect', () => {
        });

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

