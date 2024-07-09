import {Box, Button, Card, Typography} from '@mui/material';
import {PieChart} from '@mui/x-charts/PieChart';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import config from '../config.json';
import useFoodStore from './components/FoodStore';
import Food from './components/Interface';

const colors = {
    lightGray: '#e0e4ef',
    mediumGray: '#b0b8d6',
    darkGray: '#6972b0',
    lightBlue: '#989fc6',
    mediumBlue: '#8189ba',
    darkBlue: '#6a73ae',
    darkerBlue: '#4e57a3',
    darkestBlue: '#3b479d',
};

const Chart = () => {
    const navigate = useNavigate();

    const {foods} = useFoodStore();
    const [rows, setRows] = useState<Food[]>(foods);

    const categorizeData = (foods: Food[]) => {
        const categorizedData = {
            '<50 Calories': 0,
            '50-100 Calories': 0,
            '100-150 Calories': 0,
            '>150 Calories': 0,
        };

        foods.forEach((item) => {
            if (item.Calories < 50) {
                categorizedData['<50 Calories'] += 1;
            } else if (item.Calories >= 50 && item.Calories < 100) {
                categorizedData['50-100 Calories'] += 1;
            } else if (item.Calories >= 100 && item.Calories < 150) {
                categorizedData['100-150 Calories'] += 1;
            } else {
                categorizedData['>150 Calories'] += 1;
            }
        });

        return categorizedData;
    };

    const socket = new WebSocket('ws://localhost:4000');

    // Connection opened
    socket.addEventListener('open', () => {
        socket.send('Connection established');
    });

    // Listen for messages
    socket.addEventListener('message', (event) => {
        console.log('Message from server ', event.data);
        if (event.data === 'refresh') {
            fetchDataAndUpdateRows();
        }
    });

    const fetchDataAndUpdateRows = async () => {
        try {
            const response = await axios.get(`${config.SERVER_URL}/api/foods/`);
            setRows(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const prepareChartData = (data: Food[]) => {
        const categorizedData = categorizeData(data);

        const chartData = Object.entries(categorizedData).map(
            ([label, value]) => ({
                id: label,
                value,
                label,
            }),
        );

        return chartData;
    };

    useEffect(() => {
        fetchDataAndUpdateRows();
    }, []);

    const chartData = prepareChartData(rows);

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
                    minWidth: 50,
                    minHeight: 50,
                    maxWidth: 800, // Increase the maxWidth to make the card wider
                    textAlign: 'center',
                    boxShadow: 6,
                    backgroundColor: '#F8F8FF',
                    borderRadius: '16px',
                    padding: '10px',
                }}
            >
                <Typography variant='h5' component='div' gutterBottom>
                    Caloric Distribution
                </Typography>
                <Box display='flex' flexDirection='column' alignItems='center'>
                    <PieChart
                        margin={{top: 100, bottom: 100, left: 100, right: 100}}
                        series={[
                            {
                                data: chartData,
                            },
                        ]}
                        width={500} // Reduce the width of the PieChart
                        height={500} // Reduce the height of the PieChart
                        slotProps={{
                            legend: {
                                direction: 'row',
                                position: {
                                    vertical: 'bottom',
                                    horizontal: 'middle',
                                },
                                padding: 0,
                            },
                        }}
                    />
                </Box>
                <Button
                    variant='outlined'
                    sx={{
                        backgroundColor: 'white',
                        color: colors.darkBlue,
                        borderColor: colors.darkBlue,
                        '&:hover': {
                            backgroundColor: colors.darkBlue,
                            color: 'white',
                        },
                        marginTop: 2,
                    }}
                    onClick={() => navigate('/')}
                >
                    Close
                </Button>
            </Card>
        </Box>
    );
};

export default Chart;
