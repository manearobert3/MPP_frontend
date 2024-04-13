import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
} from '@mui/material';
import {useEffect, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import useFoodStore from './newEntityComponents/FoodReviewStore';
interface Inputs {
    FoodID: number;
    ReviewText: string;
    Rating: number;
    AuthorName: string;
}
const AddReview = () => {
    const {selectedFood, addFood} = useFoodStore();
    const [error, setError] = useState<string>(''); // State to hold error message

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<Inputs>({});
    const navigate = useNavigate();
    useEffect(() => {
        reset(selectedFood);
    }, [selectedFood]);
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            if (selectedFood) {
                await addFood({
                    ReviewID: Math.floor(Math.random() * 1000),
                    ...data,
                });
                reset();
                setError('');
            }
        } catch (error) {
            setError('Failed to add review: ' + error.message); // Set error state with backend error message
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
                    {error && ( // Display error message if error state is not empty
                        <Typography variant='body2' color='error'>
                            {error}
                        </Typography>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
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
                                    message: 'Rating must at most 10',
                                },
                                validate: {
                                    validNumber: (value) =>
                                        !isNaN(value) || 'Rating must be text',
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
                            label='ReviewText'
                            fullWidth
                            {...register('ReviewText', {required: true})}
                        />
                        <br />
                        <br />
                        <TextField
                            label='Author Name:'
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

export default AddReview;
