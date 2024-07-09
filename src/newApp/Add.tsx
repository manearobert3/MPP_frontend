import {
    Box,
    Button,
    Card,
    CardContent,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import {useEffect} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import useFoodStore from './components/FoodStore';

interface Inputs {
    FoodName: string;
    Calories: number;
    Fats: number;
    FoodDescription: string;
    FoodType: string;
    Protein: number;
    Sugar: number;
}

const Add = () => {
    const {selectedFood, addFood} = useFoodStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<Inputs>({});
    const navigate = useNavigate();
    useEffect(() => {
        reset(selectedFood);
    }, [selectedFood, reset]);
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        addFood({
            FoodID: Math.floor(Math.random() * 1000),
            ...data,
        });
        reset();
        navigate('/'); // Navigate to the homepage after submission
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
                        Add Form
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            label='Name'
                            fullWidth
                            {...register('FoodName', {
                                required: 'Name is required',
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
                            type='number'
                            {...register('Calories', {
                                required: 'Calories is required',
                                min: {
                                    value: 0,
                                    message: 'Calories must be 0 or above',
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
                            type='number'
                            {...register('Fats', {
                                required: 'Fats is required',
                                min: {
                                    value: 0,
                                    message: 'Fats must be 0 or above',
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
                            {...register('FoodDescription', {
                                required: 'Description is required',
                            })}
                        />
                        {errors.FoodDescription && (
                            <Typography variant='body2' color='error'>
                                {errors.FoodDescription.message}
                            </Typography>
                        )}

                        <br />
                        <br />
                        <TextField
                            label='Food Type'
                            fullWidth
                            select
                            {...register('FoodType', {
                                required: 'Food Type is required',
                            })}
                        >
                            <MenuItem value='Fruits'>Fruits</MenuItem>
                            <MenuItem value='Sweets'>Sweets</MenuItem>
                            <MenuItem value='Vegetables'>Vegetables</MenuItem>
                            <MenuItem value='Protein'>Protein</MenuItem>
                            <MenuItem value='Dairy'>Dairy</MenuItem>
                            <MenuItem value='Carbohydrates'>
                                Carbohydrates
                            </MenuItem>
                            <MenuItem value='Beverages'>Beverages</MenuItem>
                        </TextField>
                        {errors.FoodType && (
                            <Typography variant='body2' color='error'>
                                {errors.FoodType.message}
                            </Typography>
                        )}

                        <br />
                        <br />
                        <TextField
                            label='Protein'
                            fullWidth
                            type='number'
                            {...register('Protein', {
                                required: 'Protein is required',
                                min: {
                                    value: 0,
                                    message: 'Protein must be 0 or above',
                                },
                                validate: {
                                    validNumber: (value) =>
                                        !isNaN(value) ||
                                        'Protein must be a number',
                                },
                            })}
                        />
                        {errors.Protein && (
                            <Typography variant='body2' color='error'>
                                {errors.Protein.message}
                            </Typography>
                        )}

                        <br />
                        <br />
                        <TextField
                            label='Sugar'
                            fullWidth
                            type='number'
                            {...register('Sugar', {
                                required: 'Sugar is required',
                                min: {
                                    value: 0,
                                    message: 'Sugar must be 0 or above',
                                },
                                validate: {
                                    validNumber: (value) =>
                                        !isNaN(value) ||
                                        'Sugar must be a number',
                                },
                            })}
                        />
                        {errors.Sugar && (
                            <Typography variant='body2' color='error'>
                                {errors.Sugar.message}
                            </Typography>
                        )}

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

export default Add;
