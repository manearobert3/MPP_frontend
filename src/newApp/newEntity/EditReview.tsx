import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
} from '@mui/material';
import React, {useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useNavigate, useParams} from 'react-router-dom';
import Food from './newEntityComponents/FoodReviewInterface';
import useFoodStore from './newEntityComponents/FoodReviewStore';
interface Inputs {
    FoodID: number;
    ReviewText: string;
    Rating: number;
    AuthorName: string;
}
const EditReview = () => {
    const params = useParams();
    const {foods, editFood, handleClose} = useFoodStore();
    const [food, setFood] = useState<Food>();
    const [error, setError] = useState<string>(''); // State to hold error message

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<Inputs>({});
    const navigate = useNavigate();
    React.useEffect(() => {
        if (params.id)
            setFood(
                foods.find((food) => food.ReviewID === parseInt(params.id!)),
            );
        // const fetchFood = async () => {
        //     try {
        //         const response = await axios.get<Food>(
        //             `http://localhost:5050/api/foods/${params.id}`,
        //         );
        //         setFood(response.data);
        //         setFormData(response.data); // Set form data with fetched food details
        //     } catch (error) {
        //         console.error('Error fetching food:', error);
        //     }
        // };
        // fetchFood();
    }, []);
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            if (food) {
                await editFood({
                    ...food,
                    ...data,
                });
            }
        } catch (error) {
            setError('Failed to update review: ' + error.message); // Set error state with backend error message
        }
        reset();
        handleClose();
    };
    // const onSubmit: SubmitHandler<Inputs> = async (data) => {
    //     try {
    //         const updatedFoodData = {
    //             id: parseInt(String(params.id)),
    //             name: data.name,
    //             calories: data.calories,
    //             fats: data.fats,
    //             description: data.description,
    //         };
    //         console.error('food to send:', updatedFoodData);
    //         await axios.put(
    //             `http://localhost:5050/api/foods/${params.id}`,
    //             updatedFoodData,
    //         );
    //         navigate('/');
    //     } catch (error) {
    //         console.error('Error updating food:', error);
    //     }
    //     reset();
    //     handleClose();
    // };
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
                }}
            >
                <CardContent>
                    <Typography variant='h5' component='div' gutterBottom>
                        Edit Form
                    </Typography>
                    {error && ( // Display error message if error state is not empty
                        <Typography variant='body2' color='error'>
                            {error}
                        </Typography>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* <form onSubmit={handleSubmit}> */}
                        <TextField
                            //defaultValue={food?.name}
                            label='FoodID'
                            fullWidth
                            {...register('FoodID', {
                                required: true,
                                validate: {
                                    notNumber: (value) =>
                                        !isNaN(Number(value)) ||
                                        'FoodID cannot not be a number',
                                },
                            })}
                        />
                        {errors.FoodID && (
                            <Typography variant='body2' color='error'>
                                {errors.FoodID.message}
                            </Typography>
                        )}

                        <br />
                        <br />
                        <TextField
                            label='ReviewText'
                            fullWidth
                            {...register('ReviewText', {required: true})}
                        />
                        <br />
                        <br />
                        <TextField
                            label='Rating'
                            fullWidth
                            {...register('Rating', {
                                required: true,
                                min: {
                                    value: 1,
                                    message: 'Rating must be above 0',
                                },
                                max: {
                                    value: 10,
                                    message: 'Rating must be at most 10',
                                },
                                validate: {
                                    validNumber: (value) =>
                                        !isNaN(value) ||
                                        'Rating must be a number',
                                },
                            })}
                        />
                        {errors.Rating && (
                            <Typography variant='body2' color='error'>
                                {errors.Rating.message}
                            </Typography>
                        )}
                        <br />
                        <br />
                        <TextField
                            label='AuthorName'
                            fullWidth
                            {...register('AuthorName', {required: true})}
                        />
                        <br />
                        <br />
                        <Button variant='contained' type='submit' sx={{mr: 2}}>
                            Submit
                        </Button>
                        <Button
                            variant='outlined'
                            onClick={() => navigate('/review')}
                        >
                            Close
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default EditReview;
