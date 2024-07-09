import {
    Box,
    Button,
    Card,
    CardContent,
    Rating,
    TextField,
    Typography,
} from '@mui/material';
import React, {useState} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useNavigate, useParams} from 'react-router-dom';
import FoodReview from './newEntityComponents/FoodReviewInterface';
import useFoodStore from './newEntityComponents/FoodReviewStore';

interface Inputs {
    ReviewText: string;
    Rating: number;
    AuthorName: string;
}

const EditReview = () => {
    const params = useParams();
    const {foods, editFood, handleClose} = useFoodStore();
    const [review, setReview] = useState<FoodReview>();
    const [error, setError] = useState<string>(''); // State to hold error message

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: {errors},
    } = useForm<Inputs>({});
    const navigate = useNavigate();

    React.useEffect(() => {
        if (params.id) {
            const foundReview = foods.find(
                (food) => food.ReviewID === parseInt(params.id!),
            );
            setReview(foundReview);
            if (foundReview) {
                setValue('ReviewText', foundReview.ReviewText);
                setValue('Rating', foundReview.Rating);
                setValue('AuthorName', foundReview.AuthorName);
            }
        }
    }, [params.id, foods, setValue]);

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            if (review) {
                await editFood({
                    ...review,
                    ...data,
                });
            }
        } catch (error) {
            setError('Failed to update review: ' + error); // Set error state with backend error message
        }
        reset();
        handleClose();
        navigate('/review'); // Navigate back to the review page after submission
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
                        Edit Review
                    </Typography>
                    {error && ( // Display error message if error state is not empty
                        <Typography variant='body2' color='error'>
                            {error}
                        </Typography>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            label='Review Text'
                            fullWidth
                            {...register('ReviewText', {required: true})}
                        />
                        {errors.ReviewText && (
                            <Typography variant='body2' color='error'>
                                {errors.ReviewText.message}
                            </Typography>
                        )}
                        <br />
                        <br />
                        <Typography component='legend'>Rating</Typography>
                        <Controller
                            name='Rating'
                            control={control}
                            defaultValue={0}
                            render={({field}) => (
                                <Rating
                                    {...field}
                                    value={field.value}
                                    onChange={(_, value) =>
                                        field.onChange(value)
                                    }
                                />
                            )}
                        />
                        {errors.Rating && (
                            <Typography variant='body2' color='error'>
                                {errors.Rating.message}
                            </Typography>
                        )}
                        <br />
                        <br />
                        <TextField
                            label='Author Name'
                            fullWidth
                            {...register('AuthorName', {required: true})}
                        />
                        {errors.AuthorName && (
                            <Typography variant='body2' color='error'>
                                {errors.AuthorName.message}
                            </Typography>
                        )}
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
