import DeleteIcon from '@mui/icons-material/Delete';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    IconButton,
    LinearProgress,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import {useEffect, useState} from 'react';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import water1 from '../assets/water1.png';
import water2 from '../assets/water2.png';
import water3 from '../assets/water3.png';
import water4 from '../assets/water4.png';
import config from '../config.json';

const Tracker = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [calories, setCalories] = useState(0);
    const [waterCups, setWaterCups] = useState(0);
    const [protein, setProtein] = useState(0);
    const [sugar, setSugar] = useState(0);
    const [fats, setFats] = useState(0);
    const [caloriesPerDay, setCaloriesPerDay] = useState(0);
    const [remainingCalories, setRemainingCalories] = useState(0);
    const [foods, setFoods] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [grams, setGrams] = useState(0);
    const [meals, setMeals] = useState([]);
    const [lastDaysData, setLastDaysData] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    const [daysToShow, setDaysToShow] = useState(7); // Default to show last 7 days
    const authHeader = useAuthHeader();

    const [userName, setUsername] = useState('');
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
            const {userName, caloriesPerDay} = response.data;
            setUsername(userName);
            setCaloriesPerDay(caloriesPerDay);
            setRemainingCalories(caloriesPerDay - calories);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchFoods = async () => {
        try {
            const response = await axios.get(`${config.SERVER_URL}/api/foods/`);
            setFoods(response.data);
        } catch (error) {
            console.error('Error fetching foods:', error);
        }
    };

    const fetchTrackerData = async () => {
        try {
            const response = await axios.get(
                `${config.SERVER_URL}/api/tracker/${userName}/${date}`,
                {
                    headers: {
                        Authorization: authHeader,
                    },
                },
            );

            if (response.data) {
                setCalories(response.data.Calories);
                setWaterCups(response.data.WaterCups);
                setProtein(response.data.Protein);
                setSugar(response.data.Sugar);
                setFats(response.data.Fats);
            } else {
                setCalories(0);
                setWaterCups(0);
                setProtein(0);
                setSugar(0);
                setFats(0);
            }
        } catch (error) {
            setCalories(0);
            setWaterCups(0);
            setProtein(0);
            setSugar(0);
            setFats(0);
            console.error('Error fetching tracker data', error);
        }
    };

    const fetchMeals = async () => {
        try {
            const response = await axios.get(
                `${config.SERVER_URL}/api/tracker/meals/${userName}/${date}`,
                {
                    headers: {
                        Authorization: authHeader,
                    },
                },
            );
            setMeals(response.data);
        } catch (error) {
            console.error('Error fetching meals', error);
        }
    };

    const fetchLastDaysData = async (days) => {
        try {
            const response = await axios.get(
                `${config.SERVER_URL}/api/tracker/lastDays/${userName}/${days}`,
                {
                    headers: {
                        Authorization: authHeader,
                    },
                },
            );
            setLastDaysData(response.data);
        } catch (error) {
            console.error('Error fetching last days data', error);
        }
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
                userName,
                date,
                foodId: selectedFood.FoodID,
                grams,
            });
            setAlertMessage('Food added to tracker');
            setAlertSeverity('success');
            setAlertOpen(true);
            fetchTrackerData(); // Refresh the tracker data
            fetchMeals(); // Refresh the meals
        } catch (error) {
            console.error('Error adding food to tracker', error);
            setAlertMessage('Error adding food to tracker');
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };

    const sendDailyResumeEmail = async () => {
        try {
            await axios.post(
                `${config.SERVER_URL}/api/tracker/sendDailyResume`,
                {
                    userName,
                    date,
                },
            );
            setAlertMessage('Daily resume sent via email.');
            setAlertSeverity('success');
            setAlertOpen(true);
        } catch (error) {
            console.error('Error sending daily resume email', error);
            setAlertMessage('Error sending daily resume email');
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };

    const deleteMealFood = async (mealId) => {
        try {
            await axios.delete(
                `${config.SERVER_URL}/api/tracker/meals/${mealId}`,
                {
                    headers: {
                        Authorization: authHeader,
                    },
                },
            );
            setAlertMessage('Food removed from meal and tracker updated');
            setAlertSeverity('success');
            setAlertOpen(true);
            setMeals((prevMeals) =>
                prevMeals.filter((meal) => meal.MealID !== mealId),
            );
            fetchTrackerData(); // Refresh the tracker data
        } catch (error) {
            console.error('Error deleting food from meal', error);
            setAlertMessage('Failed to remove food from meal');
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };
    useEffect(() => {
        getCredentials();
        fetchFoods();
    }, []);

    useEffect(() => {
        if (userName) {
            fetchTrackerData();
            fetchMeals();
            fetchLastDaysData(daysToShow);
        }
    }, [date, userName, daysToShow]);

    useEffect(() => {
        const newRemainingCalories = caloriesPerDay - calories;
        setRemainingCalories(
            newRemainingCalories < 0 ? 0 : newRemainingCalories,
        );
    }, [calories, caloriesPerDay]);

    const handleSave = async () => {
        try {
            await axios.post(`${config.SERVER_URL}/api/tracker/`, {
                userName,
                date,
                calories,
                waterCups,
                protein,
                sugar,
                fats,
            });
            setAlertMessage('Tracker data saved');
            setAlertSeverity('success');
            setAlertOpen(true);
        } catch (error) {
            console.error('Error saving tracker data', error);
            setAlertMessage('Error saving tracker data');
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };

    const getWaterImage = (cups) => {
        if (cups >= 8) {
            return water4;
        } else if (cups >= 4) {
            return water3;
        } else if (cups >= 2) {
            return water2;
        } else {
            return water1;
        }
    };

    // Ensure the values do not exceed the limits
    const limitedCalories = Math.min(calories, caloriesPerDay);
    const limitedWaterCups = Math.min(waterCups, 8);

    const calorieProgress = (limitedCalories / caloriesPerDay) * 100;
    const waterProgress = (limitedWaterCups / 8) * 100; // Assuming the goal is 8 cups

    const circleSize = 100;

    return (
        <Container>
            <Typography variant='h4' sx={{textAlign: 'center'}}>
                Daily Tracker
            </Typography>
            <Grid container spacing={3} sx={{mt: 2}}>
                <Grid item xs={12}>
                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        <TextField
                            label='Date'
                            type='date'
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            sx={{backgroundColor: '#ECEEF8', borderRadius: 1}}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2,
                            flexWrap: 'wrap',
                        }}
                    >
                        {lastDaysData.map((day) => (
                            <Box
                                key={day.date}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    backgroundColor: 'white', // Add white background
                                    padding: 2, // Add some padding
                                    borderRadius: 1, // Add border radius for a better look
                                }}
                            >
                                <CircularProgress
                                    variant='determinate'
                                    value={
                                        (day.calories / caloriesPerDay) * 100
                                    }
                                    size={circleSize}
                                    sx={{color: '#f44336', mb: 1}}
                                />
                                <Typography variant='body2'>
                                    {new Date(day.date).toLocaleDateString()}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box
                        sx={{
                            p: 2,
                            backgroundColor: '#ECEEF8',
                            borderRadius: 1,
                        }}
                    >
                        <Autocomplete
                            options={foods}
                            getOptionLabel={(option) => option.FoodName}
                            onChange={(event, newValue) =>
                                setSelectedFood(newValue)
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label='Select Food'
                                    fullWidth
                                    sx={{mt: 2, backgroundColor: '#ECEEF8'}}
                                />
                            )}
                        />
                        <TextField
                            label='Grams'
                            type='number'
                            value={grams}
                            onChange={(e) =>
                                setGrams(Math.max(0, parseInt(e.target.value)))
                            }
                            fullWidth
                            sx={{mt: 2, backgroundColor: '#ECEEF8'}}
                        />
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={addFoodToTracker}
                            sx={{
                                backgroundColor: '#717db3',
                                my: 2,
                                color: 'white',
                                display: 'block',
                                '&:hover': {
                                    backgroundColor: '#AC74EA',
                                    color: '#ECEEF8',
                                },
                            }}
                        >
                            Add Food
                        </Button>
                        <Box
                            sx={{
                                mt: 4, // Adjust margin top as needed
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                backgroundColor: '#e0e4ef',
                                padding: 2,
                                borderRadius: 1,
                            }}
                        >
                            <Typography
                                variant='h6'
                                sx={{textAlign: 'center', mt: 2}}
                            >
                                Meals
                            </Typography>
                            {['breakfast', 'lunch', 'dinner'].map(
                                (mealType) => (
                                    <Box key={mealType} sx={{mb: 4}}>
                                        <Typography variant='h6' sx={{mb: 2}}>
                                            {mealType.charAt(0).toUpperCase() +
                                                mealType.slice(1)}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 2,
                                            }}
                                        >
                                            {meals
                                                .filter(
                                                    (meal) =>
                                                        meal.MealType ===
                                                        mealType,
                                                )
                                                .map((meal) => (
                                                    <Box
                                                        key={meal.MealID}
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent:
                                                                'space-between',
                                                            alignItems:
                                                                'center',
                                                            backgroundColor:
                                                                '#f1f2f6',
                                                            padding: 2,
                                                            borderRadius: 1,
                                                            boxShadow:
                                                                '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                        }}
                                                    >
                                                        <Typography>
                                                            {meal.FoodName} -{' '}
                                                            {meal.Grams}g
                                                        </Typography>
                                                        <IconButton
                                                            edge='end'
                                                            color='secondary'
                                                            onClick={() =>
                                                                deleteMealFood(
                                                                    meal.MealID,
                                                                )
                                                            }
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Box>
                                                ))}
                                        </Box>
                                    </Box>
                                ),
                            )}
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box
                        sx={{
                            p: 2,
                            backgroundColor: '#ECEEF8',
                            borderRadius: 1,
                        }}
                    >
                        <TextField
                            label='Calories'
                            type='number'
                            value={calories}
                            onChange={(e) =>
                                setCalories(
                                    Math.max(0, parseInt(e.target.value)),
                                )
                            }
                            fullWidth
                            sx={{mt: 2, backgroundColor: '#ECEEF8'}}
                        />
                        <TextField
                            label='Water Cups'
                            type='number'
                            value={waterCups}
                            onChange={(e) =>
                                setWaterCups(
                                    Math.max(0, parseInt(e.target.value)),
                                )
                            }
                            fullWidth
                            sx={{mt: 2, backgroundColor: '#ECEEF8'}}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 2,
                            }}
                        >
                            <img
                                src={getWaterImage(waterCups)}
                                alt={`Water level ${waterCups}`}
                                style={{height: '100px'}} // Adjust the height as needed
                            />
                        </Box>
                        <TextField
                            label='Protein (g)'
                            type='number'
                            value={protein}
                            onChange={(e) =>
                                setProtein(
                                    Math.max(0, parseInt(e.target.value)),
                                )
                            }
                            fullWidth
                            sx={{mt: 2, backgroundColor: '#ECEEF8'}}
                        />
                        <TextField
                            label='Sugar (g)'
                            type='number'
                            value={sugar}
                            onChange={(e) =>
                                setSugar(Math.max(0, parseInt(e.target.value)))
                            }
                            fullWidth
                            sx={{mt: 2, backgroundColor: '#ECEEF8'}}
                        />
                        <TextField
                            label='Fats (g)'
                            type='number'
                            value={fats}
                            onChange={(e) =>
                                setFats(Math.max(0, parseInt(e.target.value)))
                            }
                            fullWidth
                            sx={{mt: 2, backgroundColor: '#ECEEF8'}}
                        />

                        <Typography variant='h6' sx={{mt: 2}}>
                            Remaining Calories: {remainingCalories}
                        </Typography>
                        <Box
                            sx={{
                                mt: 2,
                                mb: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant='body1'>
                                Calorie Intake Progress:
                            </Typography>
                            <LinearProgress
                                variant='determinate'
                                value={calorieProgress}
                                sx={{height: '10px', borderRadius: 1}}
                            />
                        </Box>
                        <Grid container spacing={2} justifyContent='center'>
                            <Grid item>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <CircularProgress
                                        variant='determinate'
                                        value={calorieProgress}
                                        size={circleSize}
                                        sx={{
                                            color: '#f44336',
                                            mb: 1,
                                        }}
                                    />
                                    <Typography variant='body2'>
                                        Calories
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <CircularProgress
                                        variant='determinate'
                                        value={waterProgress}
                                        size={circleSize}
                                        sx={{
                                            color: '#2196f3',
                                            mb: 1,
                                        }}
                                    />
                                    <Typography variant='body2'>
                                        Water
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={handleSave}
                            sx={{
                                backgroundColor: '#717db3',
                                my: 2,
                                color: 'white',
                                display: 'block',
                                '&:hover': {
                                    backgroundColor: '#AC74EA',
                                    color: '#ECEEF8',
                                },
                            }}
                        >
                            Save
                        </Button>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={sendDailyResumeEmail}
                            sx={{
                                backgroundColor: '#717db3',
                                my: 2,
                                color: 'white',
                                display: 'block',
                                '&:hover': {
                                    backgroundColor: '#AC74EA',
                                    color: '#ECEEF8',
                                },
                            }}
                        >
                            Send Daily Resume Email
                        </Button>
                    </Box>
                </Grid>
            </Grid>
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
    );
};

export default Tracker;
