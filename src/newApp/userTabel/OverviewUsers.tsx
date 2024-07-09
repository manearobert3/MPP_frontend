import {Button, Container, CssBaseline, Typography} from '@mui/material';
import Box from '@mui/material/Box';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import {useNavigate} from 'react-router-dom';
import config from '../../config.json';
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

const OverviewUsers = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('');
    const [isOnline, setIsOnline] = useState(true); // Assume online by default
    const [users, setUsers] = useState([]);
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
            const role = response.data.role;
            setRole(role);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${config.SERVER_URL}/api/users`, {
                headers: {
                    Authorization: authHeader,
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        getCredentials();
        fetchUsers();
    }, []);

    useEffect(() => {
        checkInternetStatus();
        const interval = setInterval(checkInternetStatus, 5000); // Check every 5 seconds
        return () => clearInterval(interval);
    });

    const deleteUser = async (UserName) => {
        try {
            await axios.delete(`${config.SERVER_URL}/api/users/${UserName}`, {
                headers: {
                    Authorization: authHeader,
                },
            });
            fetchUsers(); // Refresh the user list
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const columns: GridColDef[] = [
        {field: 'UserName', headerName: 'UserName', width: 150},
        {field: 'PasswordMpp', headerName: 'Password', width: 150},
        {field: 'role', headerName: 'Role', width: 150},
        {
            field: 'actions',
            headerName: 'Actions',
            width: 300,
            renderCell: (params) => (
                <>
                    {role === 'admin' && (
                        <Button
                            variant='outlined'
                            onClick={() =>
                                navigate(`/users/edit/${params.row.UserName}`)
                            }
                            sx={{
                                color: 'orange',
                                borderColor: 'orange',
                                backgroundColor: 'white',
                                '&:hover': {
                                    backgroundColor: 'orange',
                                    color: 'white',
                                },
                            }}
                        >
                            Edit
                        </Button>
                    )}
                    {role === 'admin' && (
                        <Button
                            variant='outlined'
                            sx={{
                                color: 'red',
                                borderColor: 'red',
                                backgroundColor: 'white',
                                '&:hover': {
                                    backgroundColor: 'red',
                                    color: 'white',
                                },
                            }}
                            onClick={() => deleteUser(params.row.UserName)}
                        >
                            Delete
                        </Button>
                    )}
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
                                color: '#6a73ae',
                                textAlign: 'center', // Add this line
                            }}
                        >
                            Users Management
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
                                s
                                onClick={() => navigate('/')}
                            >
                                Back To Home
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
                                rows={users}
                                columns={columns}
                                getRowId={(row) => row.UserName}
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

export default OverviewUsers;
