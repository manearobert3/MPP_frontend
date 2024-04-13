import {Box, Button, Card} from '@mui/material';
import {PieChart} from '@mui/x-charts/PieChart';
import {useNavigate} from 'react-router-dom';
import useFoodStore from './components/FoodStore';
import Food from './components/Interface';

const Chart = () => {
    const navigate = useNavigate();

    const {foods} = useFoodStore();
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
    const chartData = prepareChartData(foods);

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
