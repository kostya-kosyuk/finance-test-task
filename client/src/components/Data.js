import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import io from 'socket.io-client';
import { Box, IconButton } from "@mui/material";
import { Add, Clear } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

const Data = () => {
    const dispatch = useDispatch();
    const quotes = useSelector(state => state.quotes.quotes);

    const trackedQuotes = useMemo(() => quotes
        ? quotes.filter(({isTracked}) => isTracked)
        : [],
    [quotes]);
    const untrackedQuotes = useMemo(() => quotes
        ? quotes.filter(({ isTracked }) => !isTracked)
        : quotes,
    [quotes]);

    const handleQuotesUpdate = useCallback((quotes) => dispatch({
        type: 'SET_QUOTES',
        payload: quotes
    }), []);

    const handleToggleQuoteTracking = useCallback((id) => {
        dispatch({
            type: 'TOGGLE_QUOTE_TRACKING',
            payload: id
        });
    }, []);

    const columns = [
        { field: 'ticker', headerName: 'Ticker' },
        { field: 'exchange', headerName: 'Exchange' },
        { field: 'price', headerName: 'Price', type: 'number' },
        { field: 'change', headerName: 'Change', type: 'number' },
        { field: 'change_percent', headerName: 'Change Percent', type: 'number' },
        { field: 'dividend', headerName: 'Dividend', type: 'number' },
        { field: 'yield', headerName: 'Yield', type: 'number' },
        {
            field: 'last_trade_time', headerName: 'Last Trade Time', type: 'dateTime',
            renderCell: (params) => {
                return (
                    <div>
                        {params.value.toLocaleTimeString()}
                    </div>
                );
            }
        },
        {
            field: 'isTracked', headerName: 'Is Tracked',
            renderCell: (params) => {
                return (
                    <Box width={'100%'}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <IconButton
                            onClick={() => handleToggleQuoteTracking(params.row.id)}
                        >
                            {params.row.isTracked
                                ? <Clear />
                                : <Add />}
                        </IconButton>
                    </Box>
                )
            },
        },
    ];

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
                    <Box width={920} margin={'auto'} marginY={2}>
                        <DataGrid
                            autoHeight
                            rowCount={quotes.length}
                            columns={columns}
                            rows={getRows(trackedQuotes)}
                        />
                    </Box>
                    <Box width={920} margin={'auto'} marginY={2}>
                        <DataGrid
                            autoHeight
                            rowCount={quotes.length}
                            columns={columns}
                            rows={getRows(untrackedQuotes)}
                        />
                    </Box>
                </>)
                : 'Loading...'}
            </>
    );
}

export default Data;

const getRows = (data) => {
    const res = data.map((el) => ({ ...el, last_trade_time: new Date(el.last_trade_time) }));

    return res;
};