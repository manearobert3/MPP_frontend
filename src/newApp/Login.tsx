import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
    Box,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import React, {useState} from 'react';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import config from '../config.json';
import * as Components from './Components';
import './style.css';

interface Inputs {
    UserName: string;
    Email: string;
    passwordMpp: string;
    Weight: number;
    Height: number;
    Age: number;
    Gender: string;
}

interface IUserData {
    username: string;
}

const Login = () => {
    const [signIn, toggle] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const {
        register: registerRegister,
        handleSubmit: handleRegisterSubmit,
        reset: resetRegisterForm,
        formState: {errors: registerErrors},
    } = useForm<Inputs>({});
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<Inputs>({});
    const navigate = useNavigate();
    const signInAuth = useSignIn<IUserData>();

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault();
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const onRegisterSubmit: SubmitHandler<Inputs> = async (data) => {
        console.log(data.Email);
        try {
            const response = await axios.put(
                `${config.SERVER_URL}/api/login/register`,
                data,
            );
            const token = response.data.token; // Assuming token is returned in response.data.token
            console.log(token);
            if (
                signInAuth({
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
                setErrorMsg(
                    error.response?.data?.message || 'An error occurred',
                );
            } else {
                console.error('Error:', error);
                setErrorMsg('An error occurred');
            }
        }

        resetRegisterForm();
    };
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const response = await axios.put(
                `${config.SERVER_URL}/api/login/add`,
                data,
            );
            const token = response.data.token; // Assuming token is returned in response.data.token
            console.log(token);
            if (
                signInAuth({
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
        <Components.Body>
            <Components.Container>
                <Components.SignUpContainer signingIn={signIn}>
                    <Components.Form
                        onSubmit={handleRegisterSubmit(onRegisterSubmit)}
                    >
                        <Components.Title>Create Account</Components.Title>
                        <Box
                            sx={{
                                width: '100%',
                                maxHeight: '60vh',
                                overflowY: 'auto',
                                padding: 2,
                                boxShadow: 3,
                                borderRadius: 2,
                            }}
                        >
                            <TextField
                                fullWidth
                                variant='outlined'
                                margin='normal'
                                label='Username'
                                {...registerRegister('UserName', {
                                    required: 'Username is required',
                                })}
                                error={!!registerErrors.UserName}
                                helperText={
                                    registerErrors.UserName
                                        ? registerErrors.UserName.message
                                        : ''
                                }
                                size='small'
                            />
                            <TextField
                                fullWidth
                                variant='outlined'
                                margin='normal'
                                label='Email'
                                {...registerRegister('Email', {
                                    required: 'Email is required',
                                })}
                                error={!!registerErrors.Email}
                                helperText={
                                    registerErrors.Email
                                        ? registerErrors.Email.message
                                        : ''
                                }
                                size='small'
                            />
                            <TextField
                                fullWidth
                                variant='outlined'
                                margin='normal'
                                label='Password'
                                type={showPassword ? 'text' : 'password'}
                                {...registerRegister('passwordMpp', {
                                    required: 'Password is required',
                                })}
                                error={!!registerErrors.passwordMpp}
                                helperText={
                                    registerErrors.passwordMpp
                                        ? registerErrors.passwordMpp.message
                                        : ''
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton
                                                aria-label='toggle password visibility'
                                                onClick={
                                                    handleClickShowPassword
                                                }
                                                onMouseDown={
                                                    handleMouseDownPassword
                                                }
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
                                size='small'
                            />
                            <TextField
                                fullWidth
                                variant='outlined'
                                margin='normal'
                                label='Weight'
                                type='number'
                                {...registerRegister('Weight', {
                                    required: 'Weight is required',
                                    min: {
                                        value: 0,
                                        message: 'Weight must be at least 0',
                                    },
                                })}
                                error={!!registerErrors.Weight}
                                helperText={
                                    registerErrors.Weight
                                        ? registerErrors.Weight.message
                                        : ''
                                }
                                size='small'
                            />
                            <TextField
                                fullWidth
                                variant='outlined'
                                margin='normal'
                                label='Height'
                                type='number'
                                {...registerRegister('Height', {
                                    required: 'Height is required',
                                    min: {
                                        value: 0,
                                        message: 'Height must be at least 0',
                                    },
                                })}
                                error={!!registerErrors.Height}
                                helperText={
                                    registerErrors.Height
                                        ? registerErrors.Height.message
                                        : ''
                                }
                                size='small'
                            />
                            <TextField
                                fullWidth
                                variant='outlined'
                                margin='normal'
                                label='Age'
                                type='number'
                                {...registerRegister('Age', {
                                    required: 'Age is required',
                                    min: {
                                        value: 0,
                                        message: 'Age must be at least 0',
                                    },
                                })}
                                error={!!registerErrors.Age}
                                helperText={
                                    registerErrors.Age
                                        ? registerErrors.Age.message
                                        : ''
                                }
                                size='small'
                            />
                            <TextField
                                fullWidth
                                variant='outlined'
                                margin='normal'
                                label='Gender'
                                select
                                SelectProps={{
                                    native: true,
                                }}
                                {...registerRegister('Gender', {
                                    required: 'Gender is required',
                                })}
                                error={!!registerErrors.Gender}
                                helperText={
                                    registerErrors.Gender
                                        ? registerErrors.Gender.message
                                        : ''
                                }
                                size='small'
                            >
                                <option value=''></option>
                                <option value='male'>Male</option>
                                <option value='female'>Female</option>
                            </TextField>
                        </Box>
                        {errorMsg && (
                            <Typography variant='body2' color='error'>
                                {errorMsg}
                                <br />
                                <br />
                            </Typography>
                        )}
                        <Components.Button type='submit'>
                            Sign Up
                        </Components.Button>
                    </Components.Form>
                </Components.SignUpContainer>
                <Components.SignInContainer signingIn={signIn}>
                    <Components.Form onSubmit={handleSubmit(onSubmit)}>
                        <Components.Title>Sign in</Components.Title>
                        <TextField
                            fullWidth
                            variant='outlined'
                            margin='normal'
                            label='Email'
                            {...register('Email', {
                                required: 'Email is required',
                            })}
                            error={!!registerErrors.Email}
                            helperText={
                                registerErrors.Email
                                    ? registerErrors.Email.message
                                    : ''
                            }
                            size='small'
                        />
                        <TextField
                            fullWidth
                            variant='outlined'
                            margin='normal'
                            label='Password'
                            type={showPassword ? 'text' : 'password'}
                            {...register('passwordMpp', {
                                required: 'Password is required',
                            })}
                            error={!!errors.passwordMpp}
                            helperText={
                                errors.passwordMpp
                                    ? errors.passwordMpp.message
                                    : ''
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton
                                            aria-label='toggle password visibility'
                                            onClick={handleClickShowPassword}
                                            onMouseDown={
                                                handleMouseDownPassword
                                            }
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
                            size='small'
                        />
                        {errorMsg && (
                            <Typography variant='body2' color='error'>
                                {errorMsg}
                                <br />
                                <br />
                            </Typography>
                        )}
                        <Components.Button type='submit'>
                            Sign In
                        </Components.Button>
                    </Components.Form>
                </Components.SignInContainer>
                <Components.OverlayContainer signingIn={signIn}>
                    <Components.Overlay signingIn={signIn}>
                        <Components.LeftOverlayPanel signingIn={signIn}>
                            <Components.Title>Welcome Back!</Components.Title>
                            <Components.Paragraph>
                                To keep connected with us please login with your
                                personal info
                            </Components.Paragraph>
                            <Components.GhostButton
                                onClick={() => toggle(true)}
                            >
                                Sign In
                            </Components.GhostButton>
                        </Components.LeftOverlayPanel>
                        <Components.RightOverlayPanel signingIn={signIn}>
                            <Components.Title>Hello, Friend!</Components.Title>
                            <Components.Paragraph>
                                Enter your personal details and start a journey
                                with Fit Buddy!
                            </Components.Paragraph>

                            <Components.GhostButton
                                onClick={() => toggle(false)}
                            >
                                Sign Up
                            </Components.GhostButton>
                        </Components.RightOverlayPanel>
                    </Components.Overlay>
                </Components.OverlayContainer>
            </Components.Container>
        </Components.Body>
    );
};

export default Login;
