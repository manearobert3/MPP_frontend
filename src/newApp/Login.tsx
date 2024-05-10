import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import {useState} from 'react';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';

interface Inputs {
    UserName: string;
    passwordMpp: string;
}
interface IUserData {
    username: string;
}
const Login = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<Inputs>({});
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault();
    };
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const signIn = useSignIn<IUserData>();
    const [errorMsg, setErrorMsg] = useState<string>('');
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const response = await axios.put(
                'http://localhost:5050/api/login/add',
                data,
            );
            const token = response.data.token; // Assuming token is returned in response.data.token
            console.log(token);
            if (
                signIn({
                    auth: {
                        token: response.data.token,
                        type: 'Bearer',
                    },
                    userState: {username: data.UserName},
                })
            ) {
                navigate('/foods');
            } else {
                console.log('ERROR');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error:', error.response?.data?.message);
                // Display error message to the user
                setErrorMsg(
                    error.response?.data?.message || 'An error occurred',
                );
            } else {
                console.error('Error:', error);
                setErrorMsg('An error occurred');
            }
        }

        reset();
    };
    return (
        <Box
            height={'100vh'}
            display='flex'
            justifyContent='center'
            alignItems='center'
            bgcolor='#90C2E7'
        >
            <Card
                sx={{
                    minWidth: 300,
                    minHeight: 400,
                    maxWidth: 400,
                    textAlign: 'center',
                    boxShadow: 6,
                    backgroundColor: '#0B5351',
                }}
            >
                <CardContent
                    sx={{
                        textAlign: 'center',
                        paddingTop: '50px',
                        paddingBottom: '50px',
                    }}
                >
                    <Typography
                        variant='h5'
                        component='div'
                        gutterBottom
                        color='#F5F6F3'
                        sx={{
                            paddingBottom: '25px',
                        }}
                        fontWeight='bold'
                    >
                        Welcome!
                    </Typography>
                    {errorMsg && (
                        <Typography variant='body2' color='error'>
                            {errorMsg}
                            <br />
                            <br />
                        </Typography>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            sx={{input: {color: '#F5F6F3'}}}
                            InputLabelProps={{style: {color: '#F5F6F3'}}}
                            label='Name'
                            fullWidth
                            {...register('UserName', {
                                required: 'Username is required',
                            })}
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
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton
                                            aria-label='toggle password visibility'
                                            onClick={handleClickShowPassword}
                                            onMouseDown={
                                                handleMouseDownPassword
                                            }
                                            edge='end'
                                            sx={{
                                                color: 'White', // Change the color of the icon button
                                            }}
                                        >
                                            {showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            fullWidth
                            InputLabelProps={{style: {color: '#F5F6F3'}}} // Change label color here
                            sx={{
                                '& input': {
                                    color: 'White', // Text color for the input field
                                },
                            }}
                            {...register('passwordMpp', {
                                required: 'Password is required',
                            })}
                        />

                        {errors.passwordMpp && (
                            <Typography variant='body2' color='error'>
                                {errors.passwordMpp.message}
                            </Typography>
                        )}
                        <br />
                        <br />
                        <Button variant='contained' type='submit' sx={{mr: 2}}>
                            Login
                        </Button>
                        <Button
                            variant='contained'
                            onClick={() => {
                                navigate('/register');
                            }}
                            sx={{mr: 2}}
                        >
                            Register
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;
