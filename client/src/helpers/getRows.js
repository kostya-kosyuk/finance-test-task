export const getRows = (data) => {
    const res = data.map((el) => ({ ...el, last_trade_time: new Date(el.last_trade_time) }));

    return res;
};

export default getRows;