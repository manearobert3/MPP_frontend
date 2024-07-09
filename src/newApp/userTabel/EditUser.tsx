import {
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
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
import {useNavigate, useParams} from 'react-router-dom';
import config from '../../config.json';

interface Inputs {
    UserName: string;
    PasswordMpp: string;
    role: string;
}

const EditUser = () => {
    const {UserName: initialUserName} = useParams<{UserName: string}>();
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<Inputs>({});
    const navigate = useNavigate();
    const authHeader = useAuthHeader();
    const [user, setUser] = useState<Inputs>({
        UserName: '',
        PasswordMpp: '',
        role: '',
    });
    const [error, setError] = useState<string>(''); // State to hold error message
    // function capitalizeFirstLetter(string) {
    //     return string.charAt(0).toUpperCase() + string.slice(1);
    // }
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    `${config.SERVER_URL}/api/users/${initialUserName}`,
                    {
                        headers: {
                            Authorization: authHeader,
                        },
                    },
                );
                setUser(response.data);
                reset(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [initialUserName, reset, authHeader]);

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            await axios.put(
                `${config.SERVER_URL}/api/users/${initialUserName}`,
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
                            label='UserName'
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            defaultValue={user.UserName}
                            {...register('UserName', {required: true})}
                        />
                        {errors.UserName && (
                            <Typography variant='body2' color='error'>
                                {errors.UserName.message}
                            </Typography>
                        )}
                        <br />
                        <br />
                        <TextField
                            label='Password'
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            defaultValue={user.PasswordMpp}
                            {...register('PasswordMpp', {required: true})}
                        />
                        {errors.PasswordMpp && (
                            <Typography variant='body2' color='error'>
                                {errors.PasswordMpp.message}
                            </Typography>
                        )}
                        <br />
                        <br />
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select
                                label='Role'
                                inputProps={{'aria-label': 'Without label'}}
                                defaultValue={user.role}
                                {...register('role', {required: true})}
                            >
                                <MenuItem value={user.role}>
                                    <em>{user.role}</em>
                                </MenuItem>
                                <MenuItem value='user'>User</MenuItem>
                                <MenuItem value='admin'>Admin</MenuItem>
                                <MenuItem value='manager'>Manager</MenuItem>
                            </Select>
                        </FormControl>
                        {errors.role && (
                            <Typography variant='body2' color='error'>
                                {errors.role.message}
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
