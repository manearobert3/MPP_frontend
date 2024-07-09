import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import * as React from 'react';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import logo from '../assets/logofinal.png'; // Import the logo image
import config from '../config.json';

const settings = ['Profile', 'Edit Account', 'Dashboard', 'Chart', 'Credits'];

interface pagesLinks {
    page: string;
    link: string;
}

const pagesLink: pagesLinks[] = [
    {
        page: 'Overview',
        link: 'foods',
    },
    {
        page: 'Review List',
        link: 'review',
    },
    {
        page: 'Chart',
        link: 'foods/chart',
    },
    {
        page: 'Tracker',
        link: 'tracker',
    },
    {
        page: 'Meal Plan',
        link: 'mealPlan',
    },
];

function ResponsiveAppBar() {
    const authHeader = useAuthHeader();
    const [role, setRole] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [isOnline, setIsOnline] = React.useState<boolean>(true); // Assume online by default
    const signOut = useSignOut();
    const navigate = useNavigate();
    const [weight, setWeight] = React.useState('');
    const [height, setHeight] = React.useState('');
    const [age, setAge] = React.useState('');
    const [gender, setGender] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [creditsOpen, setCreditsOpen] = React.useState(false);
    const path = useLocation();

    const handleCreditsClose = () => {
        setCreditsOpen(false);
    };

    const handleCreditsOpen = () => {
        setCreditsOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const checkInternetStatus = async () => {
        try {
            const response = await axios.get(
                `${config.SERVER_URL}/api/check-internet`,
            );
            setIsOnline(response.data.isOnline);
        } catch (error) {
            setIsOnline(false); // If there's an error, assume offline
        }
    };

    React.useEffect(() => {
        checkInternetStatus();
        const interval = setInterval(checkInternetStatus, 5000); // Check every 5 seconds
        return () => clearInterval(interval);
    }, []); // Added missing dependency array to avoid infinite loop

    React.useEffect(() => {
        getCredentials();
    }, [path.pathname]); // Fetch credentials on path change

    const getCredentials = async () => {
        try {
            const response = await axios.get(
                `${config.SERVER_URL}/api/login/getinfo`,
                {
                    headers: {
                        Authorization: authHeader,
                    },
                },
            );
            const {userName, role, weight, gender, age, height} = response.data;
            setRole(role);
            setUsername(userName);
            setAge(age);
            setGender(gender);
            setWeight(weight);
            setHeight(height);
            // Handle response data here
            console.log('Response:', response.data);
        } catch (error) {
            // Handle error
            console.error('Error:', error);
        }
    };

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
        null,
    );
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
        null,
    );

    if (path.pathname === '/login' || path.pathname === '/register') {
        return null;
    }

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = (setting: string) => {
        if (setting === 'Profile') {
            getCredentials();
            setOpen(true);
        }
        if (setting === 'Dashboard') {
            navigate('/');
        }
        if (setting === 'Chart') {
            navigate('/foods/chart');
        }
        if (setting === 'Edit Account') {
            navigate('/users/edit/currentUser');
        }
        if (setting === 'Credits') {
            handleCreditsOpen();
        }
        setAnchorElUser(null);
    };

    return (
        <AppBar
            position='sticky'
            sx={{backgroundColor: 'white', boxShadow: 'none'}}
        >
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                    <img
                        src={logo}
                        alt='logo'
                        style={{
                            marginRight: 10,
                            height: 50,
                        }}
                    />
                    <Typography
                        variant='h6'
                        noWrap
                        component='a'
                        href='/'
                        sx={{
                            mr: 2,
                            display: {xs: 'none', md: 'flex'},
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: '#AC74EA',
                            textDecoration: 'none',
                        }}
                    >
                        FitBuddy
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size='large'
                            aria-label='account of current user'
                            aria-controls='menu-appbar'
                            aria-haspopup='true'
                            onClick={handleOpenNavMenu}
                            color='inherit'
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id='menu-appbar'
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: {xs: 'block', md: 'none'},
                            }}
                        >
                            {pagesLink.map((pagesLink) => (
                                <MenuItem
                                    key={pagesLink.page}
                                    onClick={handleCloseNavMenu}
                                >
                                    <Typography textAlign='center'>
                                        <Link
                                            style={{
                                                textDecoration: 'none',
                                                color: '#AC74EA',
                                            }}
                                            to={`/${pagesLink.link}`}
                                        >
                                            {pagesLink.page}
                                        </Link>
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant='h5'
                        noWrap
                        component='a'
                        href='#app-bar-with-responsive-menu'
                        sx={{
                            mr: 2,
                            display: {xs: 'flex', md: 'none'},
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: '#AC74EA',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {pagesLink.map((pagesLink) => (
                            <Button
                                key={pagesLink.page}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 2,
                                    color: '#AC74EA',
                                    display: 'block',
                                    '&:hover': {
                                        backgroundColor: '#AC74EA',
                                        color: 'white',
                                    },
                                }}
                            >
                                <Link
                                    style={{
                                        textDecoration: 'none',
                                        color: 'inherit',
                                    }}
                                    to={`/${pagesLink.link}`}
                                >
                                    {pagesLink.page}
                                </Link>
                            </Button>
                        ))}
                        {(role === 'admin' || role === 'manager') && (
                            <Button
                                sx={{
                                    my: 2,
                                    color: '#AC74EA',
                                    display: 'block',
                                    '&:hover': {
                                        backgroundColor: '#AC74EA',
                                        color: 'white',
                                    },
                                }}
                                onClick={() => navigate('/foods/add')}
                            >
                                Add Food
                            </Button>
                        )}
                        {(role === 'admin' || role === 'manager') && (
                            <Button
                                sx={{
                                    my: 2,
                                    color: '#AC74EA',
                                    display: 'block',
                                    '&:hover': {
                                        backgroundColor: '#AC74EA',
                                        color: 'white',
                                    },
                                }}
                                onClick={() => navigate('/users')}
                            >
                                Users Management
                            </Button>
                        )}
                    </Box>
                    <Box>
                        <Button
                            key={'Logout'}
                            onClick={() => {
                                signOut();
                            }}
                            sx={{
                                my: 2,
                                color: '#AC74EA',
                                display: 'block',
                                '&:hover': {
                                    backgroundColor: '#AC74EA',
                                    color: 'white',
                                },
                            }}
                        >
                            <Link
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                }}
                                to={`/login`}
                            >
                                {'Logout'}
                            </Link>
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexGrow: 0,
                            mr: 2,
                        }}
                    >
                        {isOnline ? (
                            <WifiIcon sx={{color: '#AC74EA', mr: 1}} />
                        ) : (
                            <WifiOffIcon sx={{color: 'red', mr: 1}} />
                        )}
                        <Typography
                            variant='body1'
                            sx={{color: '#AC74EA', mr: 1}}
                        >
                            {isOnline ? 'Online' : 'Offline'}
                        </Typography>
                    </Box>
                    <Box sx={{flexGrow: 0}}>
                        <Tooltip title='Open settings'>
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{p: 0}}
                            >
                                <MoreVertIcon sx={{color: '#AC74EA'}} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{mt: '45px'}}
                            id='menu-appbar'
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={() => handleCloseUserMenu('')}
                        >
                            {settings.map((setting) => (
                                <MenuItem
                                    key={setting}
                                    onClick={() => handleCloseUserMenu(setting)}
                                >
                                    <Typography textAlign='center'>
                                        {setting}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>User Credentials</DialogTitle>
                <DialogContent>
                    <p>Username: {username}</p>
                    <p>Role: {role}</p>
                    <p>Weight: {weight} kg</p>
                    <p>Height: {height} cm</p>
                    <p>Age: {age} yrs</p>
                    <p>Gender: {gender}</p>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={creditsOpen} onClose={handleCreditsClose}>
                <DialogTitle>Credits</DialogTitle>
                <DialogContent>
                    <p>Developed by rob</p>
                    <p>
                        Special thanks to alexandra❤️ (master mind behind the
                        styling)
                    </p>
                    {/* Add more credits as needed */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCreditsClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </AppBar>
    );
}

export default ResponsiveAppBar;
