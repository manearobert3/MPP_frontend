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
import useFoodStore from './components/FoodStore';
import Food from './components/Interface';
interface Inputs {
    FoodName: string;
    Calories: number;
    Fats: number;
    FoodDescription: string;
}
const Edit = () => {
    const params = useParams();
    const {foods, editFood, handleClose} = useFoodStore();
    const [food, setFood] = useState<Food>();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<Inputs>({});
    const navigate = useNavigate();
    React.useEffect(() => {
        if (params.id)
            setFood(foods.find((food) => food.FoodID === parseInt(params.id!)));
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
    }, [foods, params.id]);
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        if (food) {
            editFood({
                ...food,
                ...data,
            });
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* <form onSubmit={handleSubmit}> */}
                        <TextField
                            //defaultValue={food?.name}
                            label='Name'
                            fullWidth
                            {...register('FoodName', {
                                required: true,
                                validate: {
                                    notNumber: (value) =>
                                        isNaN(Number(value)) ||
                                        'Name cannot be a number',
                                },
                            })}
                        />
                        {errors.FoodName && (
                            <Typography variant='body2' color='error'>
                                {errors.FoodName.message}
                            </Typography>
                        )}

                        <br />
                        <br />
                        <TextField
                            label='Calories'
                            fullWidth
                            {...register('Calories', {
                                required: true,
                                min: {
                                    value: 1,
                                    message: 'Calories must be above 0',
                                },
                                validate: {
                                    validNumber: (value) =>
                                        !isNaN(value) ||
                                        'Calories must be a number',
                                },
                            })}
                        />
                        {errors.Calories && (
                            <Typography variant='body2' color='error'>
                                {errors.Calories.message}
                            </Typography>
                        )}

                        <br />
                        <br />
                        <TextField
                            label='Fats'
                            fullWidth
                            {...register('Fats', {
                                required: true,
                                min: {
                                    value: 1,
                                    message: 'Fats must be above 0',
                                },
                                validate: {
                                    validNumber: (value) =>
                                        !isNaN(value) ||
                                        'Fats must be a number',
                                },
                            })}
                        />
                        {errors.Fats && (
                            <Typography variant='body2' color='error'>
                                {errors.Fats.message}
                            </Typography>
                        )}
                        <br />
                        <br />
                        <TextField
                            label='Description'
                            fullWidth
                            {...register('FoodDescription', {required: true})}
                        />
                        <br />
                        <br />
                        <Button variant='contained' type='submit' sx={{mr: 2}}>
                            Submit
                        </Button>
                        <Button
                            variant='outlined'
                            onClick={() => navigate('/')}
                        >
                            Close
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Edit;
