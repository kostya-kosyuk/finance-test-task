import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, IconButton } from "@mui/material";
import { Add, Clear, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { useDispatch } from "react-redux";
import { useCallback, useMemo } from "react";

const currency = '$';

export const TickerList = ({ title, rows }) => {
    const dispatch = useDispatch();

    const handleToggleQuoteTracking = useCallback((id) => {
        dispatch({
            type: 'TOGGLE_QUOTE_TRACKING',
            payload: id
        });
    }, []);

    const columns = useMemo([
        { field: 'ticker', headerName: 'Ticker', width: '80' },
        { field: 'exchange', headerName: 'Exchange', width: '90' },
        { field: 'name', headerName: 'Name', width: '110' },
        { field: 'price', headerName: 'Price', type: 'number', width: '70' },
        {
            field: 'change', headerName: 'Change', type: 'number', width: '70',
            renderCell: (params) => {
                const { value } = params;
                return (<Box
                    sx={{ color: value < 0 ? '#a50e0e' : '#137333' }}
                >
                    {value > 0 ? `+${value} ${currency}` : `${value}  ${currency}`}
                </Box>);
            }
        },
        {
            field: 'change_percent', headerName: 'Percent', type: 'number', width: '90',
            renderCell: (params) => {
                const { value } = params;
                return (<Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: value > 0 ? '#e6f4ea' : '#fce8e6',
                        color: value > 0 ? '#137333' : '#a50e0e',
                        borderRadius: '8px',
                        paddingX: '8px',
                        paddingY: '4px',
                    }}
                >
                    {value > 0 ? <ArrowUpward sx={{ fontSize: 16, pb: '2px' }} /> : <ArrowDownward sx={{ fontSize: 16, pb: '2px' }} />}
                    {Math.abs(value)}
                </Box>);

            }
        },
        { field: 'dividend', headerName: 'Dividend', type: 'number', width: '80' },
        { field: 'yield', headerName: 'Yield', type: 'number', width: '70' },
        {
            field: 'last_trade_time', headerName: 'Last Trade Time', type: 'dateTime', width: '90',
            renderCell: (params) => {
                return (
                    <div>
                        {params.value.toLocaleTimeString()}
                    </div>
                );
            }
        },
        {
            field: 'isTracked', headerName: 'Tracking', width: '80',
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
    ], []);
    return (
        <Box width={840} margin={'auto'} marginY={2}>
            <Typography variant="h4" align="center" my={1}>
                {title}
            </Typography>
            <DataGrid
                autoHeight
                rowCount={rows.length}
                columns={columns}
                rows={rows}

                initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5, 10, 15]}
            />
        </Box>
    );
};

export default TickerList;