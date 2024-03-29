import {Button, Container, CssBaseline} from '@mui/material';
import Box from '@mui/material/Box';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import React from 'react';
import {useNavigate} from 'react-router-dom';
import useFoodStore from './components/FoodStore';

const Overview = () => {
    const {foods, deleteFood, handleOpen} = useFoodStore();
    const navigate = useNavigate();

    const rows = foods;
    const columns: GridColDef<(typeof rows)[number]>[] = [
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
