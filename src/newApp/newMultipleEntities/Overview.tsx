import {Button, Container, CssBaseline} from '@mui/material';
import Box from '@mui/material/Box';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useNavigate} from 'react-router-dom';
import config from '../newEntity/config.json';

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
    //const [pageSize] = useState(5);
    const navigate = useNavigate();
    const [hasMore, setHasMore] = useState(true);
    const [allFoods, setAllFoods] = useState<FoodJoined[]>([]);

    useEffect(() => {
        // Initial fetch when the component mounts
        fetchData(1);
    }, []);

    const loadMoreData = async () => {
        try {
            const response = await axios.get(
                `${config.SERVER_URL}/api/food-foodreviews?pageNumber=${pageNumber}`,
            );
            const newFoods = response.data;

            if (newFoods.length === 0) {
                setHasMore(false);
            } else {
                setAllFoods((prevFoods) => [...prevFoods, ...newFoods]);
                setPageNumber((prevPageNumber) => prevPageNumber + 1);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchData = async (page: number) => {
        try {
            const response = await axios.get(
                `${config.SERVER_URL}/api/food-foodreviews?pageNumber=${page}`,
            );
            const newFoods = response.data;

            if (newFoods.length === 0) {
                setHasMore(false);
            } else {
                setAllFoods(newFoods);
                setPageNumber(page + 1);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setHasMore(false);
        }
    };

    return (
        <div>
            <React.Fragment>
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
                                next={loadMoreData}
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
                                            <div
                                                style={{display: 'table-cell'}}
                                            >
                                                <h2>Food: {food.FoodName}</h2>
                                            </div>
                                            <div
                                                style={{display: 'table-cell'}}
                                            >
                                                <p>ID: {food.FoodID}</p>
                                            </div>
                                            <div
                                                style={{display: 'table-cell'}}
                                            >
                                                <p>
                                                    Review Text:{' '}
                                                    {food.ReviewText}
                                                </p>
                                            </div>
                                            <div
                                                style={{display: 'table-cell'}}
                                            >
                                                <p>Rating: {food.Rating}</p>
                                            </div>
                                            <div
                                                style={{display: 'table-cell'}}
                                            >
                                                <p>
                                                    Author Name:{' '}
                                                    {food.AuthorName}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </InfiniteScroll>
                        </Box>
                    </Box>
                </Container>
            </React.Fragment>
        </div>
    );
};

export default OverviewJoinedTables;
