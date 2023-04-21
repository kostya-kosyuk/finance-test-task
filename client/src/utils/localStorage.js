const localStorageName = 'trackedTrickersId';

const getLocalStorageArray = () => {
    const arr = JSON.parse(localStorage.getItem(localStorageName));
    return Array.isArray(arr) ? arr : []
};

const setLocalStorageArray = (array) => localStorage.setItem(localStorageName, JSON.stringify(array));

export const addTickerIdToLocalStorage = (id) => {
    if (isIdinLocalStorage(id)) {
        return
    }
    const arr = getLocalStorageArray();
    arr.push(id);
    setLocalStorageArray(arr);
};

export const removeIdFromLocalStorage = (removeId) => {
    const arr = getLocalStorageArray().filter(id => id !== removeId);
    setLocalStorageArray(arr);
};

export const isIdinLocalStorage = (id) => getLocalStorageArray().includes(id);

export const isLocalStorageEmpty = () => getLocalStorageArray().length === 0;