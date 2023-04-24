import { setSocketInterval } from "./socketAction";

import { getInterval, updateInterval } from '../utils/settingsLocalStorage';

export const updateSocketInterval = (interval, socket) => {
    return (dispatch) => {
        if (getInterval() !== interval) {
            updateInterval(interval);
        }

        socket.emit('start', interval);

        dispatch(setSocketInterval(interval));
    };
};