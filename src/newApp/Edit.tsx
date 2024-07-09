import {
    Box,
    Button,
    Card,
    CardContent,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import {useEffect, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useNavigate, useParams} from 'react-router-dom';
import useFoodStore from './components/FoodStore';
import Food from './components/Interface';

interface Inputs {
    FoodName: string;
    Calories: number;
    Fats: number;
    FoodDescription: string;
    FoodType: string;
    Protein: number;
    Sugar: number;
}

const Edit = () => {
    const params = useParams();
    const {foods, editFood, handleClose} = useFoodStore();
    const [food, setFood] = useState<Food>();

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {errors},
    } = useForm<Inputs>({
        defaultValues: {
            FoodName: '',
            Calories: 0,
            Fats: 0,
            FoodDescription: '',
            FoodType: '',
            Protein: 0,
            Sugar: 0,
        },
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (params.id) {
            const foundFood = foods.find(
                (food) => food.FoodID === parseInt(params.id!),
            );
            if (foundFood) {
                setFood(foundFood);
                // Set the default values for the form
                setValue('FoodName', foundFood.FoodName);
                setValue('Calories', foundFood.Calories);
                setValue('Fats', foundFood.Fats);
                setValue('FoodDescription', foundFood.FoodDescription);
                setValue('FoodType', foundFood.FoodType);
                setValue('Protein', foundFood.Protein);
                setValue('Sugar', foundFood.Sugar);
            }
        }
    }, [params.id, foods, setValue]);

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
                            {...register('FoodName', {
                                required: 'Name is required',
                                validate: {
                                    notNumber: (value) =>
                                        isNaN(Number(value)) ||
                                        'Name cannot be a number',
                                },
                            })}
                            size='small'
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
                                required: 'Calories is required',
                                min: {
                                    value: 1,
                                    message: 'Calories must be above 0',
                                },
                                validate: {
                                    validNumber: (value) =>
                                        !isNaN(Number(value)) ||
                                        'Calories must be a number',
                                },
                            })}
                            size='small'
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
                                required: 'Fats is required',
                                min: {
                                    value: 0,
                                    message: 'Fats must be 0 or above',
                                },
                                validate: {
                                    validNumber: (value) =>
                                        !isNaN(Number(value)) ||
                                        'Fats must be a number',
                                },
                            })}
                            size='small'
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
                            size='small'
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
                                required: 'Food type is required',
                            })}
                            size='small'
                        >
                            {[
                                'Fruits',
                                'Sweets',
                                'Vegetables',
                                'Protein',
                                'Dairy',
                                'Carbohydrates',
                                'Beverages',
                            ].map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
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
                            {...register('Protein', {
                                required: 'Protein is required',
                                min: {
                                    value: 0,
                                    message: 'Protein must be 0 or above',
                                },
                                validate: {
                                    validNumber: (value) =>
                                        !isNaN(Number(value)) ||
                                        'Protein must be a number',
                                },
                            })}
                            size='small'
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
                            {...register('Sugar', {
                                required: 'Sugar is required',
                                min: {
                                    value: 0,
                                    message: 'Sugar must be 0 or above',
                                },
                                validate: {
                                    validNumber: (value) =>
                                        !isNaN(Number(value)) ||
                                        'Sugar must be a number',
                                },
                            })}
                            size='small'
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

export default Edit;
