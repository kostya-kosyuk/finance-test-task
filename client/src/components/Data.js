import React, { useState, useEffect, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import io from 'socket.io-client';
import { Box, IconButton } from "@mui/material";
import { Add, Clear } from '@mui/icons-material';

const Data = () => {
    const [quotes, setQuotes] = useState([]);
    const trackedQuotes = useMemo(() => quotes
        ? quotes.filter(qoute => qoute.isTracked)
        : null,
    [quotes]);
    const untrackedQuotes = useMemo(() => quotes
        ? quotes.filter(qoute => !qoute.isTracked)
        : null,
    [quotes]);

    const handleQuotesUpdate = (newQuotes) => {
        setQuotes(prev => {
            if (prev.length !== 0) {
                return newQuotes.map(quote => {
                    const prevQuote = prev.find(({ticker}) => ticker === quote.ticker);

                    return { ...prevQuote, ...quote };
                })
            } else {
                return newQuotes.map(quote => ({id: quote.ticker, ...quote, isTracked: false}));
            }
        });
    };

    const handleToggleQuoteTracking = (id) => {
        setQuotes(prev => {
            const updatedQuotes = prev.map(quote => {
                if (quote.id === id) {
                    return { ...quote, isTracked: !quote.isTracked };
                }
                return quote;
            });

            return updatedQuotes;
        });
    };

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
                            {params.value
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