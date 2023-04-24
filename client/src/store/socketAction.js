const SET_INTERVAL = 'SET_INTERVAL';
const SET_SOCKET_CONNECTED = 'SET_SOCKET_CONNECTED';
const SET_SOCKET_DISCONNECTED = 'SET_SOCKET_DISCONNECTED';

export const setSocketInterval = (interval) => ({
    type: SET_INTERVAL,
    payload: interval,
});

export const socketConnected = () => ({
    type: SET_SOCKET_CONNECTED
});

export const socketDisconnected = () => ({
    type: SET_SOCKET_DISCONNECTED
});