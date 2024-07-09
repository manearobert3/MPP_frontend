import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    CssBaseline,
    Typography,
} from '@mui/material';
import axios from 'axios';
import {useEffect, useState} from 'react';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import config from '../config.json';

const categoryImages = {
    Fruits: 'src/assets/fruits.jpg',
    Sweets: 'src/assets/sweets.jpg',
    Vegetables: 'src/assets/vegetables.webp',
    Protein: 'src/assets/protein.jpg',
    Dairy: 'src/assets/dairy.jpg',
    Carbohydrates: 'src/assets/carbohydrates.jpg',
    Beverages: 'src/assets/beverages.jpg',
};

const MealPlan = () => {
    const authHeader = useAuthHeader();
    const [mealPlan, setMealPlan] = useState(null);
    const [username, setUsername] = useState('');

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
            setUsername(response.data.userName);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const fetchSavedMealPlan = async () => {
        try {
            const response = await axios.get(
                `${config.SERVER_URL}/api/mealPlan/getSavedMealPlan/${username}`,
                {
                    headers: {
                        Authorization: authHeader,
                    },
                },
            );
            setMealPlan(response.data);
        } catch (error) {
            console.error('Error fetching saved meal plan:', error);
        }
    };

    const fetchMealPlan = async () => {
        try {
            const response = await axios.get(
                `${config.SERVER_URL}/api/mealPlan/generateMealPlan/${username}`,
                {
                    headers: {
                        Authorization: authHeader,
                    },
                },
            );
            setMealPlan(response.data);
            await saveMealPlan(response.data); // Save the new meal plan
        } catch (error) {
            console.error('Error fetching meal plan:', error);
        }
    };

    const saveMealPlan = async (mealPlan) => {
        try {
            await axios.post(
                `${config.SERVER_URL}/api/mealPlan/saveMealPlan`,
                {
                    userName: username,
                    mealPlan: JSON.stringify(mealPlan),
                },
                {
                    headers: {
                        Authorization: authHeader,
                    },
                },
            );
        } catch (error) {
            console.error('Error saving meal plan:', error);
        }
    };

    useEffect(() => {
        getCredentials();
    }, []);

    useEffect(() => {
        if (username) {
            fetchSavedMealPlan();
        }
    }, [username]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: '',
                padding: 4,
            }}
        >
            <CssBaseline />
            <Container
                maxWidth='lg'
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#e0e4ef',
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Typography variant='h4' sx={{textAlign: 'center', mb: 4}}>
                    New Meal Plan
                </Typography>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={fetchMealPlan}
                    sx={{alignSelf: 'center', mb: 4}}
                >
                    Generate New Meal Plan
                </Button>
                {mealPlan && (
                    <>
                        <Typography
                            variant='h6'
                            sx={{mb: 2, textAlign: 'center'}}
                        >
                            Total Meal Plan Calories:{' '}
                            {mealPlan.totalFoodCalories.toFixed(3)}kcal
                        </Typography>
                        <Box>
                            {['breakfast', 'lunch', 'dinner'].map(
                                (mealType) => (
                                    <Box key={mealType} sx={{mb: 4}}>
                                        <Typography
                                            variant='h5'
                                            sx={{
                                                mb: 2,

                                                textAlign: 'center',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {mealType}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 2,
                                            }}
                                        >
                                            {mealPlan[mealType].map((food) => (
                                                <Card
                                                    key={food.FoodID}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        boxShadow: 2,
                                                        transition:
                                                            'transform 0.2s',
                                                        '&:hover': {
                                                            transform:
                                                                'scale(1.02)',
                                                            boxShadow:
                                                                '0 8px 16px rgba(0, 0, 0, 0.2)',
                                                        },
                                                    }}
                                                >
                                                    <CardMedia
                                                        component='img'
                                                        sx={{
                                                            width: 150,
                                                            height: 150,
                                                            paddingLeft: '10px',
                                                        }}
                                                        image={
                                                            categoryImages[
                                                                food.FoodType
                                                            ]
                                                        }
                                                        alt={food.FoodType}
                                                    />
                                                    <CardContent sx={{flex: 1}}>
                                                        <Typography variant='h6'>
                                                            {food.FoodName}
                                                        </Typography>
                                                        <Typography variant='body1'>
                                                            {food.Calories.toFixed(
                                                                3,
                                                            )}{' '}
                                                            kcal
                                                        </Typography>
                                                        <Typography variant='body2'>
                                                            {food.Grams.toFixed(
                                                                3,
                                                            )}{' '}
                                                            grams
                                                        </Typography>
                                                        <Typography variant='body2'>
                                                            Fats:{' '}
                                                            {food.Fats.toFixed(
                                                                3,
                                                            )}{' '}
                                                            g
                                                        </Typography>
                                                        <Typography variant='body2'>
                                                            Sugars:{' '}
                                                            {food.Sugar.toFixed(
                                                                3,
                                                            )}{' '}
                                                            g
                                                        </Typography>
                                                        <Typography variant='body2'>
                                                            Protein:{' '}
                                                            {food.Protein.toFixed(
                                                                3,
                                                            )}{' '}
                                                            g
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Box>
                                    </Box>
                                ),
                            )}
                        </Box>
                    </>
                )}
            </Container>
        </Box>
    );
};

export default MealPlan;
