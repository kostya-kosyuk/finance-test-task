import React, { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getRows } from '../helpers/getRows';
import TickerList from "./TickerList";
import { setQuotes } from "../store/quotesActions";
import { updateSocketInterval } from "../store/socketAsyncAction";
import { socketConnected, socketDisconnected } from "../store/socketAction";
import { getInterval } from '../utils/settingsLocalStorage';
import { InputLabel, MenuItem, FormControl, Select, Box } from '@mui/material';

const Data = () => {
    const dispatch = useDispatch();
    const socket = useSelector(state => state.socket.socket);
    const quotes = useSelector(state => state.quotes.quotes);
    const interval = useSelector(state => state.socket.interval);

    const trackedQuotesRows = useMemo(() => quotes
        ? getRows(quotes.filter(({isTracked}) => isTracked))
        : [],
    [quotes]);
    const untrackedQuotesRows = useMemo(() => quotes
        ? getRows(quotes.filter(({ isTracked }) => !isTracked))
        : getRows(quotes),
    [quotes]);

    const handleQuotesUpdate = useCallback((quotes) => dispatch(setQuotes(quotes)), []);

    const handleSetInterval = useCallback((interval) => dispatch(updateSocketInterval(interval, socket)), []);

    useEffect(() => {
        socket.on('connect', () => {
            dispatch(socketConnected(true));
            dispatch(updateSocketInterval(getInterval(), socket))
        });

        socket.on('ticker', (quotes) => {
            handleQuotesUpdate(quotes);
        });

        socket.on('disconnect', () => {
            dispatch(socketDisconnected(false));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
            <>
            <Box
                sx={{
                    display: 'grid',
                }}
            >
                <FormControl variant="standard" sx={{ m: 1, minWidth: 90, placeSelf: 'center', }}>
                    <InputLabel id="demo-simple-select-standard-label">Update Interval</InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={interval}
                        onChange={(event) => handleSetInterval(event.target.value)}
                        label="Age"
                    >
                        {[1, 2, 5, 10].map(time => {
                            return (
                                <MenuItem key={time} value={time * 1000}>{`${time}s`}</MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Box>
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

