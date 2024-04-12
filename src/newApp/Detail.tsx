import {
    Box,
    Button,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import React, {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
//import useFoodStore from './components/FoodStore';
import useFoodStore from './components/FoodStore';
import Food from './components/Interface';

const Detail = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [food, setFood] = useState<Food>();
    const {foods} = useFoodStore();
    React.useEffect(() => {
        if (params.id)
            setFood(foods.find((food) => food.id === parseInt(params.id!)));
        // const fetchFood = async () => {
        //     try {
        //         const response = await axios.get<Food>(
        //             `http://localhost:5050/api/foods/${params.id}`,
        //         );
        //         setFood(response.data);
        //     } catch (error) {
        //         console.error('Error fetching food:', error);
        //     }
        // };
        // fetchFood();
    }, [params.id]);
    return (
        <Box
            height={'100vh'}
            display='flex'
            justifyContent='center'
            alignItems='center'
            bgcolor='#FAF9F6'
        >
            <Card
                sx={{
                    minWidth: 300,
                    maxWidth: 400,
                    textAlign: 'center',
                    boxShadow: 6,
                    backgroundColor: '#F8F8FF',
                    borderRadius: '16px',
                }}
            >
                <CardContent>
                    <Typography variant='h5' component='div'>
                        Name: {food?.name || ''}
                    </Typography>
                    {/* <Typography
                        sx={{fontSize: 14}}
                        color='text.secondary'
                        gutterBottom
                    >
                        Word of the Day
                    </Typography> */}

                    {/* <Typography variant='body1'>Description:</Typography>
                    <Typography variant='h6'>
                        {food?.description || ''}
                    </Typography> */}
                    <br />
                    <Typography sx={{mb: 1}} color='text.secondary'>
                        <List>
                            <ListItem>
                                <ListItemText
                                    primary={`Description: ${
                                        food?.description || ''
                                    }`}
                                />
                            </ListItem>

                            <ListItem>
                                <ListItemText
                                    primary={`Calories: ${
                                        food?.calories || ''
                                    }`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary={`Fats: ${food?.fats || ''}`}
                                />
                            </ListItem>
                            <Button
                                variant='outlined'
                                onClick={() => navigate('/')}
                            >
                                Close
                            </Button>
                        </List>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Detail;
