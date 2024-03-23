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
    name: string;
    calories: number;
    fats: number;
    description: string;
}
const Edit = () => {
    const params = useParams();
    const {editFood, handleClose, foods} = useFoodStore();
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
            setFood(foods.find((food) => food.id === parseInt(params.id!)));
    }, []);
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
                        <TextField
                            label='Name'
                            fullWidth
                            {...register('name', {
                                required: true,
                                validate: {
                                    notNumber: (value) =>
                                        isNaN(Number(value)) ||
                                        'Name cannot be a number',
                                },
                            })}
                        />
                        {errors.name && (
                            <Typography variant='body2' color='error'>
                                {errors.name.message}
                            </Typography>
                        )}

                        <br />
                        <br />
                        <TextField
                            label='Calories'
                            fullWidth
                            {...register('calories', {
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
                        {errors.calories && (
                            <Typography variant='body2' color='error'>
                                {errors.calories.message}
                            </Typography>
                        )}

                        <br />
                        <br />
                        <TextField
                            label='Fats'
                            fullWidth
                            {...register('fats', {
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
                        {errors.fats && (
                            <Typography variant='body2' color='error'>
                                {errors.fats.message}
                            </Typography>
                        )}
                        <br />
                        <br />
                        <TextField
                            label='Description'
                            fullWidth
                            {...register('description', {required: true})}
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
