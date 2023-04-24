import io from 'socket.io-client';
import { getInterval, updateInterval } from '../utils/settingsLocalStorage';

const socket = io('http://localhost:4000');

const initialState = {
    socket: socket,
    isConnected: false,
    interval: getInterval(),
};

export const socketReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_INTERVAL': {
            const interval = action.payload;

            if (interval < 0) {
                return {
                    ...state,
                }
            }

            updateInterval(interval);

            return {
                ...state,
                interval,
            };
        }
        case 'SET_SOCKET_CONNECTED': {
            return {
                ...state,
                isConnected: true,
            }
        }
        case 'SET_SOCKET_DISCONNECTED': {
            return {
                ...state,
                isConnected: false,
            }
        }
        default:
            return state;
    }
};