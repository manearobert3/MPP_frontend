import {Button, Container, CssBaseline} from '@mui/material';
import Box from '@mui/material/Box';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import useFoodStore from './components/FoodStore';
import Food from './components/Interface';
const Overview = () => {
    const {foods, deleteFood, handleOpen} = useFoodStore();
    const navigate = useNavigate();
    const [isOnline, setIsOnline] = useState<boolean>(true); // Assume online by default
    const [rows, setRows] = useState<Food[]>(foods);
    //const [foods, setFoods] = useState<Food[]>([]);

    // const getData = async () => {
    //     const response = await Axios.get<Food[]>(
    //         'http://localhost:5050/api/foods/',
    //     );
    //     setFoods(response.data);
    // };
    // useEffect(() => {
    //     getData();
    // }, []);
    const checkInternetStatus = async () => {
        try {
            const response = await axios.get(
                'http://localhost:5050/api/check-internet',
            );
            setIsOnline(response.data.isOnline);
        } catch (error) {
            setIsOnline(false); // If there's an error, assume offline
        }
    };
    useEffect(() => {
        checkInternetStatus();
        const interval = setInterval(checkInternetStatus, 5000); // Check every 5 seconds
        return () => clearInterval(interval);
    });
    const socket = new WebSocket('ws://localhost:3000');

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
                'http://localhost:5050/api/foods/',
            );
            setRows(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const sendMessage = () => {
        socket.send('hello from frontend');
    };

    const columns: GridColDef<Food[][number]>[] = [
        {field: 'id', headerName: 'ID', width: 70},
        {field: 'name', headerName: 'Food Name', width: 130},
        {field: 'calories', headerName: 'Calories', width: 130},
        {
            field: 'actions',
            headerName: 'Actions',
            width: 300,
            renderCell: (params) => (
                // <ButtonGroup
                //     variant='outlined'
                //     color='primary'
                //     aria-label='outlined primary button group'
                //     sx={{}}
                // >
                <>
                    <Button
                        variant='outlined'
                        onClick={() => {
                            navigate(`/foods/edit/${params.row.id}`);
                        }}
                        sx={{
                            color: 'orange',
                            borderColor: 'orange',
                            '&:hover': {
                                backgroundColor: 'orange',
                                color: 'white',
                            },
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant='outlined'
                        sx={{
                            color: 'red',
                            borderColor: 'red',
                            '&:hover': {
                                backgroundColor: 'red',
                                color: 'white',
                            },
                        }}
                        onClick={() => deleteFood(params.row.id)}
                    >
                        Delete
                    </Button>

                    <Button
                        variant='outlined'
                        onClick={() => navigate(`/foods/${params.row.id}`)}
                        sx={{
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
                <div>
                    <p>Internet status: {isOnline ? 'Online' : 'Offline'}</p>
                    {!isOnline && <p>Backend server is not reachable.</p>}
                </div>
                <Container maxWidth='lg'>
                    <Box sx={{height: '100vh'}}>
                        <h1>CRUD App</h1>

                        <Button
                            variant='outlined'
                            sx={{
                                color: 'green',
                                borderColor: 'green',
                                '&:hover': {
                                    backgroundColor: 'green',
                                    color: 'white',
                                },
                            }}
                            onClick={() => {
                                navigate(`/foods/add`);
                                handleOpen();
                            }}
                        >
                            Add
                        </Button>
                        <Button
                            variant='outlined'
                            sx={{
                                color: 'green',
                                borderColor: 'green',
                                '&:hover': {
                                    backgroundColor: 'green',
                                    color: 'white',
                                },
                            }}
                            onClick={() => {
                                sendMessage();
                            }}
                        >
                            Send message w web sockets
                        </Button>
                        <Button
                            variant='outlined'
                            sx={{
                                color: 'yellow',
                                borderColor: 'yellow',
                                '&:hover': {
                                    backgroundColor: 'yellow',
                                    color: 'white',
                                },
                            }}
                            onClick={() => {
                                navigate(`/foods/chart`);
                                handleOpen();
                            }}
                        >
                            Chart
                        </Button>
                        <Box sx={{height: 400, width: '100%'}}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
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

export default Overview;
