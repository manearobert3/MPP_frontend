import {Button, Container, CssBaseline, Typography} from '@mui/material';
import Box from '@mui/material/Box';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import {useNavigate} from 'react-router-dom';
import config from './config.json';
import Food from './newEntityComponents/FoodReviewInterface';
import useFoodStore from './newEntityComponents/FoodReviewStore';

const colors = {
    lightGray: '#e0e4ef',
    mediumGray: '#b0b8d6',
    darkGray: '#6972b0',
    lightBlue: '#989fc6',
    mediumBlue: '#8189ba',
    darkBlue: '#6a73ae',
    darkerBlue: '#4e57a3',
    darkestBlue: '#3b479d',
};

const OverviewNewEntity = () => {
    const {foods, deleteFood} = useFoodStore();
    const navigate = useNavigate();
    const [role, setRole] = useState('');
    const [isOnline, setIsOnline] = useState<boolean>(true); // Assume online by default
    const [rows, setRows] = useState<Food[]>(foods);
    const authHeader = useAuthHeader();

    const checkInternetStatus = async () => {
        try {
            const response = await axios.get(
                `${config.SERVER_URL}/api/check-internet`,
            );
            setIsOnline(response.data.isOnline);
        } catch (error) {
            setIsOnline(false); // If there's an error, assume offline
        }
    };

    const getCredentials = async () => {
        try {
            const response = await axios.get(
                `${config.SERVER_URL}/api/login/getinfo`,
                {
                    headers: {
                        Authorization: authHeader,
                    },
                },
            );
            const role = response.data;
            setRole(role);

            // Handle response data here
            console.log('Response:', response.data);
        } catch (error) {
            // Handle error
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        // Call getCredentials when the component mounts
        getCredentials();
    }, []);

    useEffect(() => {
        // Update rows whenever foods change
        setRows(foods);
    }, [foods]);

    useEffect(() => {
        checkInternetStatus();
        const interval = setInterval(checkInternetStatus, 5000); // Check every 5 seconds
        return () => clearInterval(interval);
    });

    const socket = new WebSocket('ws://localhost:4000');

    // Connection opened
    socket.addEventListener('open', (event) => {
        socket.send('Connection established');
    });

    // Listen for messages
    socket.addEventListener('message', (event) => {
        console.log('Message from server ', event.data);
        if (event.data === 'refresh') {
            fetchDataAndUpdateRows();
        }
    });

    const fetchDataAndUpdateRows = async () => {
        try {
            const response = await axios.get(
                'http://localhost:5000/api/reviews/',
            );
            setRows(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const columns: GridColDef<Food[][number]>[] = [
        {field: 'ReviewID', headerName: 'ReviewID', width: 70},
        {field: 'Rating', headerName: 'Rating', width: 130},
        {field: 'AuthorName', headerName: 'Author Name', width: 130},
        {
            field: 'actions',
            headerName: 'Actions',
            width: 300,
            renderCell: (params) => (
                <>
                    {(role === 'admin' || role === 'manager') && (
                        <Button
                            variant='outlined'
                            onClick={() => {
                                navigate(`/review/edit/${params.row.ReviewID}`);
                            }}
                            sx={{
                                backgroundColor: 'white',
                                color: colors.darkBlue,
                                borderColor: colors.darkBlue,
                                '&:hover': {
                                    backgroundColor: colors.darkBlue,
                                    color: 'white',
                                },
                                marginRight: 1,
                            }}
                        >
                            Edit
                        </Button>
                    )}
                    {(role === 'admin' || role === 'manager') && (
                        <Button
                            variant='outlined'
                            sx={{
                                backgroundColor: 'white',
                                color: 'red',
                                borderColor: 'red',
                                '&:hover': {
                                    backgroundColor: 'red',
                                    color: 'white',
                                },
                                marginRight: 1,
                            }}
                            onClick={() => deleteFood(params.row.ReviewID)}
                        >
                            Delete
                        </Button>
                    )}
                    <Button
                        variant='outlined'
                        onClick={() =>
                            navigate(`/review/${params.row.ReviewID}`)
                        }
                        sx={{
                            backgroundColor: 'white',
                            color: 'purple',
                            borderColor: 'purple',
                            '&:hover': {
                                backgroundColor: 'purple',
                                color: 'white',
                            },
                        }}
                    >
                        Detail
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <React.Fragment>
                <CssBaseline />
                <Container maxWidth='lg'>
                    <Box
                        sx={{
                            height: '100vh',
                            textAlign: 'center',
                            paddingTop: 4,
                        }}
                    >
                        <Typography
                            variant='h4'
                            component='div'
                            sx={{
                                backgroundColor: '#f1f2f6',
                                padding: '10px',
                                borderRadius: '5px',
                                display: 'inline-block',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                color: colors.darkestBlue,
                                textAlign: 'center', // Add this line
                            }}
                        >
                            Review List
                        </Typography>
                        <br></br>
                        <br></br>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                paddingBottom: 2,
                            }}
                        >
                            {(role === 'admin' || role === 'manager') && (
                                <Button
                                    variant='outlined'
                                    sx={{
                                        backgroundColor: 'white',
                                        color: 'green',
                                        borderColor: 'green',
                                        marginRight: 2,
                                        '&:hover': {
                                            backgroundColor: 'green',
                                            color: 'white',
                                        },
                                    }}
                                    onClick={() => {
                                        navigate(`/review/add`);
                                    }}
                                >
                                    Add
                                </Button>
                            )}
                            <Button
                                variant='outlined'
                                sx={{
                                    backgroundColor: 'white', // Add this line

                                    color: colors.darkBlue,
                                    borderColor: colors.darkBlue,
                                    '&:hover': {
                                        backgroundColor: colors.darkBlue,
                                        color: 'white',
                                    },
                                }}
                                onClick={() => {
                                    navigate('/');
                                }}
                            >
                                Back To Foods
                            </Button>
                        </Box>
                        <Box
                            sx={{
                                height: 400,
                                width: '100%',
                                backgroundColor: 'white',
                                padding: 2,
                                borderRadius: 1,
                                boxShadow: 3,
                            }}
                        >
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                getRowId={(row) => row.ReviewID}
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 5,
                                        },
                                    },
                                }}
                                pageSizeOptions={[5]}
                                checkboxSelection
                                disableRowSelectionOnClick
                            />
                        </Box>
                    </Box>
                </Container>
            </React.Fragment>
        </div>
    );
};

export default OverviewNewEntity;
