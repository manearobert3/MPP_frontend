import {Box, Button, Card} from '@mui/material';
import {PieChart} from '@mui/x-charts/PieChart';
import axios from 'axios';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import useFoodStore from './components/FoodStore';
import Food from './components/Interface';

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
    const socket = new WebSocket('ws://localhost:3000');

    // Connection opened
    socket.addEventListener('open', (event) => {
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
            const response = await axios.get(
                'http://localhost:5050/api/foods/',
            );
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
    const chartData = prepareChartData(rows);

    return (
        <>
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
                        maxWidth: 600,
                        textAlign: 'center',
                        boxShadow: 6,
                        backgroundColor: '#F8F8FF',
                        borderRadius: '16px',
                    }}
                >
                    <PieChart
                        series={[
                            {
                                data: chartData,
                            },
                        ]}
                        width={600}
                        height={200}
                    />
                    <br />
                    <Button variant='outlined' onClick={() => navigate('/')}>
                        Close
                    </Button>
                </Card>
            </Box>
        </>
    );
};

export default Chart;
