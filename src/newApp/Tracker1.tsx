import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    LinearProgress,
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
    const authHeader = useAuthHeader();

    const [userName, setUsername] = useState('');

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

    const addFoodToTracker = async () => {
        if (!selectedFood || grams <= 0) {
            alert('Please select a food and enter a valid amount of grams.');
            return;
        }

        try {
            await axios.post(`${config.SERVER_URL}/api/tracker/addFood`, {
                userName,
                date,
                foodId: selectedFood.FoodID,
                grams,
            });
            alert('Food added to tracker');
            fetchTrackerData(); // Refresh the tracker data
        } catch (error) {
            console.error('Error adding food to tracker', error);
        }
    };

    useEffect(() => {
        getCredentials();
        fetchFoods();
    }, []);

    useEffect(() => {
        if (userName) {
            fetchTrackerData();
        }
    }, [date, userName]);

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
            alert('Tracker data saved');
        } catch (error) {
            console.error('Error saving tracker data', error);
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
    const proteinProgress = (protein / 100) * 100; // Assuming the goal is 100g protein

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
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box
                        sx={{p: 2, backgroundColor: '#ECEEF8', borderRadius: 1}}
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
                            <Grid item>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                ></Box>
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
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Tracker;
