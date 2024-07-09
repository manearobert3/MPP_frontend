import {Button, Container, CssBaseline} from '@mui/material';
import Box from '@mui/material/Box';
import axios from 'axios';
import {useCallback, useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useNavigate, useParams} from 'react-router-dom';
import config from '../config.json';

interface FoodJoined {
    FoodID: number;
    FoodName: string;
    ReviewText: string;
    Rating: number;
    AuthorName: string;
    ReviewID: number;
    RowNum: number;
}

const OverviewJoinedTables = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const navigate = useNavigate();
    const [hasMore, setHasMore] = useState(true);
    const params = useParams<{id: string}>(); // Get the ID from the URL parameter
    const [allFoods, setAllFoods] = useState([] as FoodJoined[]);

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(
                `${config.SERVER_URL}/api/food-foodreviews/${params.id}?pageNumber=${pageNumber}`,
            );
            const newFoods = response.data;

            if (newFoods.length === 0) {
                setHasMore(false);
            } else {
                setAllFoods((prevFoods) => [...prevFoods, ...newFoods]);
                setPageNumber((prevPage) => prevPage + 1);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setHasMore(false);
        }
    }, [pageNumber, params.id]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <div>
            <CssBaseline />
            <Container maxWidth='lg'>
                <Box sx={{height: '100vh'}}>
                    <h1>Joined Tables</h1>
                    <Button
                        variant='outlined'
                        sx={{
                            color: 'yellow',
                            borderColor: 'yellow',
                            '&:hover': {
                                backgroundColor: 'yellow',
                                color: 'white',
                            },
                        }}
                        onClick={() => {
                            navigate(`/`);
                        }}
                    >
                        Go Back
                    </Button>
                    <Box sx={{height: 400, width: '100%'}}>
                        <InfiniteScroll
                            dataLength={allFoods.length}
                            next={fetchData}
                            hasMore={hasMore}
                            loader={<h4>Loading...</h4>}
                            endMessage={
                                <p style={{textAlign: 'center'}}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }
                        >
                            <div style={{display: 'table', width: '100%'}}>
                                {allFoods.map((food, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'table-row',
                                            backgroundColor:
                                                index % 2 === 0
                                                    ? '#f9f9f9'
                                                    : 'white', // Alternate row colors
                                            borderBottom: '1px solid #ddd',
                                            padding: '10px 0',
                                        }}
                                    >
                                        <div style={{display: 'table-cell'}}>
                                            <h2>Food: {food.FoodName}</h2>
                                        </div>
                                        <div style={{display: 'table-cell'}}>
                                            <p>ID: {food.FoodID}</p>
                                        </div>
                                        <div style={{display: 'table-cell'}}>
                                            <p>
                                                Review Text: {food.ReviewText}
                                            </p>
                                        </div>
                                        <div style={{display: 'table-cell'}}>
                                            <p>Rating: {food.Rating}</p>
                                        </div>
                                        <div style={{display: 'table-cell'}}>
                                            <p>
                                                Author Name: {food.AuthorName}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </InfiniteScroll>
                    </Box>
                </Box>
            </Container>
        </div>
    );
};

export default OverviewJoinedTables;
