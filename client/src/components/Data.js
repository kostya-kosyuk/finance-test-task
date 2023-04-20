import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import io from 'socket.io-client';
import { Box } from "@mui/material";

const columns = [
    { field: 'ticker', headerName: 'Ticker'},
    { field: 'exchange', headerName: 'Exchange'},
    { field: 'price', headerName: 'Price', type: 'number'},
    { field: 'change', headerName: 'Change', type: 'number'},
    { field: 'change_percent', headerName: 'Change Percent', type: 'number'},
    { field: 'dividend', headerName: 'Dividend', type: 'number'},
    { field: 'yield', headerName: 'Yield', type: 'number'},
    { field: 'last_trade_time', headerName: 'Last Trade Time', type: 'dateTime',
        renderCell: (params) => {
            return (
                <div>
                    {params.value.toLocaleTimeString()}
                </div>
            );
        }
},
];

const Data = () => {
    const [quotes, setQuotes] = useState([]);

    useEffect(() => {
        const socket = io('http://localhost:4000');

        socket.on('connect', () => {
            socket.emit('start');
        });

        socket.on('ticker', (quotes) => {
            setQuotes(quotes);
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
                ? (<Box width={820} margin={'auto'}>
                    <DataGrid
                        autoHeight
                        rowCount={quotes.length}
                        columns={columns}
                        rows={getRows(quotes)}
                    />
                </Box>)
                : 'Loading...'}
            </>
    );
}

export default Data;

const getRows = (data) => {
    const res = data.map((el) => ({ id: el.ticker, ...el, last_trade_time: new Date(el.last_trade_time) }));

    return res;
};