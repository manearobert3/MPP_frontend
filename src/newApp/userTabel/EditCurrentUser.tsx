import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import {useEffect, useState} from 'react';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import config from '../../config.json';

interface Inputs {
    username: string;
    PasswordMpp: string;
    Weight: number;
    Height: number;
    Age: number;
    Gender: string;
    CaloriesPerDay: number;
}

const EditUser = () => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: {errors},
    } = useForm<Inputs>({});
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const authHeader = useAuthHeader();
    const [user, setUser] = useState<Inputs | null>(null);
    const [error, setError] = useState<string>(''); // State to hold error message
    const [autoCalculateCalories, setAutoCalculateCalories] =
        useState<boolean>(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    `${config.SERVER_URL}/api/login/getinfo`,
                    {
                        headers: {
                            Authorization: authHeader,
                        },
                    },
                );
                console.log('Response data:', response.data); // Log the response data

                const {
                    userName,

                    weight,
                    height,
                    age,
                    gender,
                    caloriesPerDay,
                } = response.data;
                setUsername(userName);
                setUser({
                    username: username,
                    PasswordMpp: '',
                    Weight: weight || 0,
                    Height: height || 0,
                    Age: age || 0,
                    Gender: gender || '',
                    CaloriesPerDay: caloriesPerDay || 0,
                });

                // Populate the form fields with fetched data
                setValue('PasswordMpp', '');
                setValue('Weight', weight || 0);
                setValue('Height', height || 0);
                setValue('Age', age || 0);
                setValue('Gender', gender || '');
                setValue('CaloriesPerDay', caloriesPerDay || 0);

                reset({
                    PasswordMpp: '',
                    Weight: weight || 0,
                    Height: height || 0,
                    Age: age || 0,
                    Gender: gender || '',
                    CaloriesPerDay: caloriesPerDay || 0,
                });
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [reset, setValue, authHeader]);

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        data.username = username;
        if (autoCalculateCalories) {
            data.CaloriesPerDay = 0;
        }
        try {
            await axios.put(
                `${config.SERVER_URL}/api/users/currentUser`,
                data,
                {
                    headers: {
                        Authorization: authHeader,
                    },
                },
            );
            reset();
            setError('');
            navigate('/users'); // Navigate back to users overview
        } catch (error) {
            setError('Failed to update user: ' + error); // Set error state with backend error message
        }
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
                        Edit User
                    </Typography>
                    {error && (
                        <Typography variant='body2' color='error'>
                            {error}
                        </Typography>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            label='Password'
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            defaultValue={user?.PasswordMpp || ''}
                            {...register('PasswordMpp', {required: true})}
                        />
                        {errors.PasswordMpp && (
                            <Typography variant='body2' color='error'>
                                {errors.PasswordMpp.message}
                            </Typography>
                        )}
                        <br />
                        <br />
                        <TextField
                            label='Weight'
                            fullWidth
                            type='number'
                            InputLabelProps={{
                                shrink: true,
                            }}
                            defaultValue={user?.Weight || ''}
                            {...register('Weight', {required: true})}
                        />
                        {errors.Weight && (
                            <Typography variant='body2' color='error'>
                                {errors.Weight.message}
                            </Typography>
                        )}
                        <br />
                        <br />
                        <TextField
                            label='Height'
                            fullWidth
                            type='number'
                            InputLabelProps={{
                                shrink: true,
                            }}
                            defaultValue={user?.Height || ''}
                            {...register('Height', {required: true})}
                        />
                        {errors.Height && (
                            <Typography variant='body2' color='error'>
                                {errors.Height.message}
                            </Typography>
                        )}
                        <br />
                        <br />
                        <TextField
                            label='Age'
                            fullWidth
                            type='number'
                            InputLabelProps={{
                                shrink: true,
                            }}
                            defaultValue={user?.Age || ''}
                            {...register('Age', {required: true})}
                        />
                        {errors.Age && (
                            <Typography variant='body2' color='error'>
                                {errors.Age.message}
                            </Typography>
                        )}
                        <br />
                        <br />
                        <FormControl fullWidth>
                            <InputLabel>Gender</InputLabel>
                            <Select
                                label='Gender'
                                inputProps={{'aria-label': 'Without label'}}
                                defaultValue={user?.Gender || ''}
                                {...register('Gender', {required: true})}
                            >
                                <MenuItem value='male'>Male</MenuItem>
                                <MenuItem value='female'>Female</MenuItem>
                            </Select>
                        </FormControl>
                        {errors.Gender && (
                            <Typography variant='body2' color='error'>
                                {errors.Gender.message}
                            </Typography>
                        )}
                        <br />
                        <br />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={autoCalculateCalories}
                                    onChange={(e) =>
                                        setAutoCalculateCalories(
                                            e.target.checked,
                                        )
                                    }
                                />
                            }
                            label='Auto Calculate Calories'
                        />

                        {/* <TextField
                            label='Calories Per Day'
                            fullWidth
                            type='float'
                            InputLabelProps={{
                                shrink: true,
                            }}
                            defaultValue={user?.CaloriesPerDay || ''}
                            {...register('CaloriesPerDay', {required: true})}
                        />
                        {errors.CaloriesPerDay && (
                            <Typography variant='body2' color='error'>
                                {errors.CaloriesPerDay.message}
                            </Typography>
                        )} */}
                        <TextField
                            label='Calories Per Day'
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            defaultValue={user?.CaloriesPerDay || ''}
                            {...register('CaloriesPerDay', {required: true})}
                            disabled={autoCalculateCalories}
                            InputProps={{
                                style: {
                                    backgroundColor: autoCalculateCalories
                                        ? '#f0f0f0'
                                        : 'inherit',
                                },
                            }}
                        />
                        {errors.CaloriesPerDay && (
                            <Typography variant='body2' color='error'>
                                {errors.CaloriesPerDay.message}
                            </Typography>
                        )}

                        <br />
                        <br />
                        <Button variant='contained' type='submit' sx={{mr: 2}}>
                            Submit
                        </Button>
                        <Button
                            variant='outlined'
                            onClick={() => navigate('/users')}
                        >
                            Close
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default EditUser;
