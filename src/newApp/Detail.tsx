import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    List,
    ListItem,
    ListItemText,
    Rating,
    Typography,
} from '@mui/material';
import axios from 'axios';
import {useEffect, useState} from 'react';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useNavigate, useParams} from 'react-router-dom';
import config from '../config.json';
import useFoodStore from './components/FoodStore';
import Food from './components/Interface';
import FoodReview from './newEntity/newEntityComponents/FoodReviewInterface';

const Detail = () => {
    const navigate = useNavigate();
    const params = useParams();
    const authHeader = useAuthHeader();
    const [food, setFood] = useState<Food>();
    const {foods} = useFoodStore();
    const [reviews, setReviews] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [role, setRole] = useState('');
    const pageSize = 5; // Set your desired page size here

    type FoodType =
        | 'Fruits'
        | 'Sweets'
        | 'Vegetables'
        | 'Protein'
        | 'Dairy'
        | 'Carbohydrates'
        | 'Beverages';

    const foodTypeImages: Record<FoodType, string> = {
        Fruits: '/assets/fruits.jpg',
        Sweets: '/assets/sweets.jpg',
        Vegetables: '/assets/vegetables.webp',
        Protein: '/assets/protein.jpg',
        Dairy: '/assets/dairy.jpg',
        Carbohydrates: '/assets/Carbohydrates.jpg',
        Beverages: '/assets/beverages.jpg',
    };

    const categoryImages = {
        Fruits: '/assets/fruits.jpg',
        Sweets: '/assets/sweets.jpg',
        Vegetables: '/assets/vegetables.webp',
        Protein: '/assets/protein.jpg',
        Dairy: '/assets/dairy.jpg',
        Carbohydrates: '/assets/Carbohydrates.jpg',
        Beverages: '/assets/beverages.jpg',
    };

    useEffect(() => {
        if (params.id) {
            setFood(foods.find((food) => food.FoodID === parseInt(params.id!)));
        }
    }, [params.id, foods]);

    useEffect(() => {
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
                setRole(response.data.role);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        getCredentials();
    }, [authHeader]);

    const fetchReviews = async (page: number) => {
        try {
            const response = await axios.get(
                `${config.SERVER_URL}/api/food-foodreviews/${params.id}?page=${page}&pageSize=${pageSize}`,
            );
            if (response.data.length < pageSize) {
                setHasMore(false);
            }
            setReviews((prevReviews) => [...prevReviews, ...response.data]);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setHasMore(false);
        }
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
        if (!expanded) {
            fetchReviews(page);
        }
    };

    const fetchMoreReviews = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchReviews(nextPage);
    };

    const deleteReview = async (reviewId: number) => {
        try {
            await axios.delete(`${config.SERVER_URL}/api/reviews/${reviewId}`, {
                headers: {
                    Authorization: authHeader,
                },
            });
            setReviews((prevReviews) =>
                prevReviews.filter((review) => review.ReviewID !== reviewId),
            );
        } catch (error) {
            console.error('Error deleting review:', error);
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
                    minWidth: 400,
                    maxWidth: 800,
                    textAlign: 'center',
                    boxShadow: 6,
                    backgroundColor: '#F8F8FF',
                    borderRadius: '16px',
                    padding: '20px',
                }}
            >
                {food?.FoodType &&
                    foodTypeImages[food.FoodType as FoodType] && (
                        <CardMedia
                            component='img'
                            height='200'
                            image={
                                categoryImages[
                                    food.FoodType as keyof typeof categoryImages
                                ]
                            }
                            alt={food.FoodType}
                        />
                    )}
                <CardContent>
                    <Typography variant='h4' component='div' gutterBottom>
                        {food?.FoodName || ''}
                    </Typography>
                    <List
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <ListItem
                            sx={{
                                justifyContent: 'center',
                            }}
                        >
                            <ListItemText
                                primary={`Description: ${
                                    food?.FoodDescription || ''
                                }`}
                                primaryTypographyProps={{
                                    variant: 'body1',
                                    component: 'span',
                                    align: 'center',
                                }}
                                sx={{color: '#555', fontWeight: 'bold'}}
                            />
                        </ListItem>
                        <ListItem
                            sx={{
                                justifyContent: 'center',
                            }}
                        >
                            <ListItemText
                                primary={`Calories: ${food?.Calories || ''}`}
                                primaryTypographyProps={{
                                    variant: 'body1',
                                    component: 'span',
                                    align: 'center',
                                }}
                                sx={{color: '#ff7043', fontWeight: 'bold'}}
                            />
                        </ListItem>
                        <ListItem
                            sx={{
                                justifyContent: 'center',
                            }}
                        >
                            <ListItemText
                                primary={`Fats: ${food?.Fats || ''}`}
                                primaryTypographyProps={{
                                    variant: 'body1',
                                    component: 'span',
                                    align: 'center',
                                }}
                                sx={{color: '#ffa726', fontWeight: 'bold'}}
                            />
                        </ListItem>
                        <ListItem
                            sx={{
                                justifyContent: 'center',
                            }}
                        >
                            <ListItemText
                                primary={`Protein: ${food?.Protein || ''}`}
                                primaryTypographyProps={{
                                    variant: 'body1',
                                    component: 'span',
                                    align: 'center',
                                }}
                                sx={{color: '#66bb6a', fontWeight: 'bold'}}
                            />
                        </ListItem>
                        <ListItem
                            sx={{
                                justifyContent: 'center',
                            }}
                        >
                            <ListItemText
                                primary={`Sugar: ${food?.Sugar || ''}`}
                                primaryTypographyProps={{
                                    variant: 'body1',
                                    component: 'span',
                                    align: 'center',
                                }}
                                sx={{color: '#42a5f5', fontWeight: 'bold'}}
                            />
                        </ListItem>
                    </List>
                    <Button
                        variant='outlined'
                        onClick={() => navigate('/')}
                        sx={{mt: 2, mr: 2}}
                    >
                        Close
                    </Button>
                    <Button
                        variant='outlined'
                        onClick={() => navigate(`/review/add/${params.id}`)}
                        sx={{mt: 2}}
                    >
                        Add Review
                    </Button>
                    <Accordion
                        expanded={expanded}
                        onChange={handleExpandClick}
                        sx={{mt: 2}}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls='panel1a-content'
                            id='panel1a-header'
                        >
                            <Typography>Show Reviews</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box
                                id='scrollableDiv'
                                sx={{
                                    height: 300, // Fixed height for the review section
                                    overflowY: 'auto', // Scrollable
                                }}
                            >
                                <InfiniteScroll
                                    dataLength={reviews.length}
                                    next={fetchMoreReviews}
                                    hasMore={hasMore}
                                    loader={<Typography>Loading...</Typography>}
                                    endMessage={
                                        <Typography>
                                            Yay! You have seen it all.
                                        </Typography>
                                    }
                                    scrollableTarget='scrollableDiv' // Set the scrollable target
                                >
                                    {reviews.length > 0 ? (
                                        reviews.map((review: FoodReview) => (
                                            <Box
                                                key={`${review.ReviewID}-${review.FoodID}`} // Ensure unique keys
                                                sx={{
                                                    mb: 2,
                                                    p: 2,
                                                    border: '1px solid #ddd',
                                                    borderRadius: '8px',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                <Typography variant='body1'>
                                                    {review.ReviewText}
                                                </Typography>
                                                <Rating
                                                    value={review.Rating}
                                                    readOnly
                                                    sx={{mt: 1}}
                                                />
                                                <Typography
                                                    variant='body2'
                                                    color='textSecondary'
                                                    sx={{mt: 1}}
                                                >
                                                    - {review.AuthorName}
                                                </Typography>
                                                {(role === 'admin' ||
                                                    role === 'manager') && (
                                                    <>
                                                        <Button
                                                            variant='outlined'
                                                            onClick={() =>
                                                                navigate(
                                                                    `/review/edit/${review.ReviewID}`,
                                                                )
                                                            }
                                                            sx={{
                                                                color: 'orange',
                                                                borderColor:
                                                                    'orange',
                                                                '&:hover': {
                                                                    backgroundColor:
                                                                        'orange',
                                                                    color: 'white',
                                                                },
                                                                mt: 1,
                                                                mr: 1,
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant='outlined'
                                                            sx={{
                                                                color: 'red',
                                                                borderColor:
                                                                    'red',
                                                                '&:hover': {
                                                                    backgroundColor:
                                                                        'red',
                                                                    color: 'white',
                                                                },
                                                                mt: 1,
                                                            }}
                                                            onClick={() =>
                                                                deleteReview(
                                                                    review.ReviewID,
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </Button>
                                                    </>
                                                )}
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography>
                                            No reviews available.
                                        </Typography>
                                    )}
                                </InfiniteScroll>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Detail;
