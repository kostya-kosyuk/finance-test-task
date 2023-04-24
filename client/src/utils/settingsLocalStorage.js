const localStorageName = 'settings';

const defaultInterval = 5000;

const getLocalStorageSettings = () => {
    const settings = JSON.parse(localStorage.getItem(localStorageName));
    return settings ? settings : {};
};

const setLocalStorageSettings = (settings) => localStorage.setItem(localStorageName, JSON.stringify(settings));

export const updateInterval = (interval) => {
    const settings = getLocalStorageSettings();

    settings['interval'] = interval >=  1000 ? interval : defaultInterval;

    setLocalStorageSettings(settings);
};

export const getInterval = () => {
    const settings = getLocalStorageSettings();

    if (Object.hasOwnProperty.call(settings, 'interval')) {
        return settings.interval >= 1000 ? settings.interval : defaultInterval;
    } else {
        return defaultInterval;
    }
};