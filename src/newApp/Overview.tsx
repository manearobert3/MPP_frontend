import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Pagination,
    Select,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import {useNavigate} from 'react-router-dom';
import config from '../config.json';
import useFoodStore from './components/FoodStore';
import Food from './components/Interface';

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

const Overview = () => {
    const authHeader = useAuthHeader();
    const [open, setOpen] = useState(false);
    const [mealDialogOpen, setMealDialogOpen] = useState(false);
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [mealType, setMealType] = useState('');
    const [grams, setGrams] = useState('');
    const handleClose = () => {
        setOpen(false);
        setMealDialogOpen(false);
        setCategoryDialogOpen(false);
        setSelectedFood(null);
        setMealType('');
        setGrams('');
    };
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const {foods, deleteFood} = useFoodStore();
    const navigate = useNavigate();
    const [rows, setRows] = useState<Food[]>(foods);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [lowerBound, setLowerBound] = useState('');
    const [upperBound, setUpperBound] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    useEffect(() => {
        // Call getCredentials when the component mounts
        getCredentials();
    }, []);

    useEffect(() => {
        // Update rows whenever foods change
        setRows(foods);
    }, [foods]);

    const socket = new WebSocket('ws://localhost:4000');

    // Connection opened
    socket.addEventListener('open', () => {
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
            const response = await axios.get(`${config.SERVER_URL}/api/foods/`);
            setRows(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
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
            const {userName, role, weight, gender, age, height} = response.data;
            setRole(role);
            setUsername(userName);
            setAge(age);
            setGender(gender);
            setWeight(weight);
            setHeight(height);
            // Handle response data here
            console.log('Response:', response.data);
        } catch (error) {
            // Handle error
            console.error('Error:', error);
        }
    };

    const handlePageChange = (
        event: React.ChangeEvent<unknown>,
        value: number,
    ) => {
        setPage(value);
    };

    const addFoodToTracker = async () => {
        if (!selectedFood || grams <= 0) {
            setAlertMessage(
                'Please select a food and enter a valid amount of grams.',
            );
            setAlertSeverity('error');
            setAlertOpen(true);
            return;
        }
        try {
            await axios.post(`${config.SERVER_URL}/api/tracker/addFood`, {
                userName: username,
                date: new Date().toISOString().split('T')[0],
                foodId: selectedFood.FoodID,
                grams: parseInt(grams),
            });
            setAlertMessage('Food added to tracker');
            setAlertSeverity('success');
            setAlertOpen(true);
        } catch (error) {
            console.error('Error adding food to tracker', error);
            setAlertMessage('Error adding food to tracker');
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };

    const handleAddFoodToMeal = async () => {
        try {
            await axios.post(
                `${config.SERVER_URL}/api/tracker/addMealFood`,
                {
                    userName: username,
                    date: new Date().toISOString().split('T')[0],
                    mealType,
                    foodId: selectedFood.FoodID,
                    grams: parseInt(grams),
                },
                {
                    headers: {
                        Authorization: authHeader,
                    },
                },
            );
            handleClose();
            setAlertMessage('Food added to meal');
            setAlertSeverity('success');
            setAlertOpen(true);
        } catch (error) {
            console.error('Error adding food to meal', error);
            setAlertMessage('Failed to add food to meal');
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };

    const handleSuggestRandomFood = () => {
        setCategoryDialogOpen(true);
    };

    const handleSelectCategory = (category) => {
        const filteredFoodsByCategory = rows.filter(
            (food) => food.FoodType === category,
        );
        const randomFood =
            filteredFoodsByCategory[
                Math.floor(Math.random() * filteredFoodsByCategory.length)
            ];
        navigate(`/foods/${randomFood.FoodID}`);
        handleClose();
    };

    const categoryImages = {
        Fruits: 'src/assets/fruits.jpg',
        Sweets: 'src/assets/sweets.jpg',
        Vegetables: 'src/assets/vegetables.webp',
        Protein: 'src/assets/protein.jpg',
        Dairy: 'src/assets/dairy.jpg',
        Carbohydrates: 'src/assets/carbohydrates.jpg',
        Beverages: 'src/assets/beverages.jpg',
    };

    const filteredFoods = rows.filter((food) => {
        const matchesSearchTerm = food.FoodName.toLowerCase().includes(
            searchTerm.toLowerCase(),
        );
        const matchesLowerBound =
            lowerBound === '' || food.Calories >= parseInt(lowerBound);
        const matchesUpperBound =
            upperBound === '' || food.Calories <= parseInt(upperBound);
        return matchesSearchTerm && matchesLowerBound && matchesUpperBound;
    });

    return (
        <Box
            sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}
        >
            <React.Fragment>
                <CssBaseline />
                <br></br>
                <Container
                    maxWidth='lg'
                    sx={{flex: 1, display: 'flex', flexDirection: 'column'}}
                >
                    <Box sx={{flex: 1}}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginBottom: '10px',
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
                                Home Page
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 2,
                                marginBottom: '20px',
                            }}
                        >
                            <TextField
                                label='Search by name'
                                variant='outlined'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{
                                    backgroundColor: 'white',
                                }}
                            />

                            <Button
                                variant='outlined'
                                sx={{
                                    backgroundColor: 'white',
                                    color: colors.darkBlue,
                                    borderColor: colors.darkBlue,
                                    '&:hover': {
                                        backgroundColor: colors.darkBlue,
                                        color: 'white',
                                    },
                                }}
                                onClick={handleSuggestRandomFood}
                            >
                                Surprise Me 😋
                            </Button>
                        </Box>
                        <Typography
                            variant='h6'
                            component='div'
                            sx={{
                                textAlign: 'center',
                                color: colors.darkestBlue,
                                marginBottom: '10px',
                            }}
                        >
                            Search by Calories
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 2,
                                marginBottom: '20px',
                            }}
                        >
                            <TextField
                                label='Lower Bound'
                                type='number'
                                variant='outlined'
                                value={lowerBound}
                                onChange={(e) => setLowerBound(e.target.value)}
                                sx={{
                                    backgroundColor: 'white',
                                }}
                            />
                            <TextField
                                label='Upper Bound'
                                type='number'
                                variant='outlined'
                                value={upperBound}
                                onChange={(e) => setUpperBound(e.target.value)}
                                sx={{
                                    backgroundColor: 'white',
                                }}
                            />
                        </Box>
                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>User Credentials</DialogTitle>
                            <DialogContent>
                                <p>Username: {username}</p>
                                <p>Role: {role}</p>
                                <p>Weight: {weight} kg</p>
                                <p>Height: {height} cm</p>
                                <p>Age: {age} yrs</p>
                                <p>Gender: {gender}</p>
                            </DialogContent>

                            <DialogActions>
                                <Button onClick={handleClose}>Close</Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog open={mealDialogOpen} onClose={handleClose}>
                            <DialogTitle>Add Food to Meal</DialogTitle>
                            <DialogContent>
                                <Select
                                    value={mealType}
                                    onChange={(e) =>
                                        setMealType(e.target.value)
                                    }
                                    displayEmpty
                                    fullWidth
                                    sx={{mb: 2}}
                                >
                                    <MenuItem value='' disabled>
                                        Select Meal
                                    </MenuItem>
                                    <MenuItem value='breakfast'>
                                        Breakfast
                                    </MenuItem>
                                    <MenuItem value='lunch'>Lunch</MenuItem>
                                    <MenuItem value='dinner'>Dinner</MenuItem>
                                </Select>
                                <TextField
                                    label='Grams'
                                    type='number'
                                    value={grams}
                                    onChange={(e) => setGrams(e.target.value)}
                                    fullWidth
                                    sx={{mb: 2}}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button
                                    onClick={() => {
                                        addFoodToTracker();
                                        handleAddFoodToMeal();
                                    }}
                                >
                                    Add
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog open={categoryDialogOpen} onClose={handleClose}>
                            <DialogTitle>Select a Food Category</DialogTitle>
                            <DialogContent>
                                {Object.keys(categoryImages).map((category) => (
                                    <Button
                                        key={category}
                                        onClick={() =>
                                            handleSelectCategory(category)
                                        }
                                        sx={{
                                            display: 'block',
                                            width: '100%',
                                            my: 1,
                                        }}
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </DialogContent>
                        </Dialog>

                        <Box>
                            {filteredFoods
                                .slice((page - 1) * pageSize, page * pageSize)
                                .map((food) => (
                                    <Card
                                        key={food.FoodID}
                                        sx={{
                                            mb: 2,
                                            display: 'flex',
                                            border: `1px solid ${colors.lightGray}`,
                                            boxShadow:
                                                '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'scale(1.02)',
                                                boxShadow:
                                                    '0 8px 16px rgba(0, 0, 0, 0.2)',
                                            },
                                        }}
                                    >
                                        <CardMedia
                                            component='img'
                                            sx={{width: 140}}
                                            image={
                                                categoryImages[
                                                    food.FoodType as keyof typeof categoryImages
                                                ]
                                            }
                                            alt={food.FoodType}
                                        />
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <CardContent>
                                                <Typography
                                                    variant='h5'
                                                    component='div'
                                                >
                                                    {food.FoodName}
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        mt: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        variant='body2'
                                                        color='text.secondary'
                                                        sx={{
                                                            mr: 2,
                                                            color: colors.mediumGray,
                                                        }}
                                                    >
                                                        🍽️ Calories:{' '}
                                                        {food.Calories}
                                                    </Typography>
                                                    <Typography
                                                        variant='body2'
                                                        color='text.secondary'
                                                        sx={{
                                                            mr: 2,
                                                            color: colors.mediumBlue,
                                                        }}
                                                    >
                                                        🥗 Type: {food.FoodType}
                                                    </Typography>
                                                    <Typography
                                                        variant='body2'
                                                        color='text.secondary'
                                                        sx={{
                                                            mr: 2,
                                                            color: colors.darkGray,
                                                        }}
                                                    >
                                                        🍫 Sugar: {food.Sugar}g
                                                    </Typography>
                                                    <Typography
                                                        variant='body2'
                                                        color='text.secondary'
                                                        sx={{
                                                            mr: 2,
                                                            color: colors.darkBlue,
                                                        }}
                                                    >
                                                        💪 Protein:{' '}
                                                        {food.Protein}g
                                                    </Typography>
                                                    <Typography
                                                        variant='body2'
                                                        color='text.secondary'
                                                        sx={{
                                                            color: colors.darkerBlue,
                                                        }}
                                                    >
                                                        📄{' '}
                                                        {food.FoodDescription}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                            <CardActions>
                                                {(role === 'admin' ||
                                                    role === 'manager') && (
                                                    <Button
                                                        size='small'
                                                        onClick={() =>
                                                            navigate(
                                                                `/foods/edit/${food.FoodID}`,
                                                            )
                                                        }
                                                        sx={{
                                                            color: colors.darkGray,
                                                            borderColor:
                                                                colors.darkGray,
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    colors.darkGray,
                                                                color: 'white',
                                                            },
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>
                                                )}
                                                {(role === 'admin' ||
                                                    role === 'manager') && (
                                                    <Button
                                                        size='small'
                                                        sx={{
                                                            color: colors.darkGray,
                                                            borderColor:
                                                                colors.darkGray,
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    colors.darkGray,
                                                                color: 'white',
                                                            },
                                                        }}
                                                        onClick={() =>
                                                            deleteFood(
                                                                food.FoodID,
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                                <Button
                                                    size='small'
                                                    onClick={() =>
                                                        navigate(
                                                            `/foods/${food.FoodID}`,
                                                        )
                                                    }
                                                    sx={{
                                                        color: colors.darkerBlue,
                                                        borderColor:
                                                            colors.darkerBlue,
                                                        '&:hover': {
                                                            backgroundColor:
                                                                colors.darkerBlue,
                                                            color: 'white',
                                                        },
                                                    }}
                                                >
                                                    Details & Reviews
                                                </Button>
                                                <Button
                                                    size='small'
                                                    onClick={() => {
                                                        setSelectedFood(food);
                                                        setMealDialogOpen(true);
                                                    }}
                                                    sx={{
                                                        color: colors.darkerBlue,
                                                        borderColor:
                                                            colors.darkerBlue,
                                                        '&:hover': {
                                                            backgroundColor:
                                                                colors.darkerBlue,
                                                            color: 'white',
                                                        },
                                                    }}
                                                >
                                                    +
                                                </Button>
                                            </CardActions>
                                        </Box>
                                    </Card>
                                ))}
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 4,
                            }}
                        >
                            <Pagination
                                count={Math.ceil(
                                    filteredFoods.length / pageSize,
                                )}
                                page={page}
                                onChange={handlePageChange}
                                color='primary'
                            />
                        </Box>
                    </Box>
                    <Snackbar
                        open={alertOpen}
                        autoHideDuration={6000}
                        onClose={handleAlertClose}
                    >
                        <Alert
                            onClose={handleAlertClose}
                            severity={alertSeverity}
                            sx={{width: '100%'}}
                        >
                            {alertMessage}
                        </Alert>
                    </Snackbar>
                </Container>
            </React.Fragment>
        </Box>
    );
};

export default Overview;
