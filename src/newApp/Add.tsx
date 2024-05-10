import {
    Box,
    Button,
    Card,
    CardContent,
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
        if (selectedFood) {
            addFood({
                FoodID: Math.floor(Math.random() * 1000),
                ...data,
            });
        }
        reset();
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

export default Add;
