import {default as Axios, default as axios} from 'axios';
import {create} from 'zustand';
import getAuthToken from '../../getAuthToken';
import config from '../config.json';
import {default as Food, default as FoodReview} from './FoodReviewInterface';

interface useFoodStoreProps {
    opened: boolean;
    handleOpen: (food?: Food) => void;
    handleClose: () => void;
    foods: Food[];
    deleteFood: (foodID: number) => void;
    addFood: (food: Food) => void;
    selectedFood: Food;
    editFood: (food: Food) => void;
    isOnline: boolean;
    checkInternetStatus: () => Promise<void>;
}
Axios.get<Food[]>(`${config.SERVER_URL}/api/reviews`)
    .then((response) => {
        useFoodStore.setState({foods: response.data});
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });
const fetchFoods = async () => {
    try {
        const response = await axios.get<Food[]>(
            `${config.SERVER_URL}/api/reviews`,
        );
        useFoodStore.setState({foods: response.data});
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
// const useFoodStore = create<useFoodStoreProps>((set) => ({
//     opened: false,
//     selectedFood: {} as Food,
//     handleOpen: (food?: Food) => set({opened: true, selectedFood: food}),
//     editFood: (food: Food) => {
//         set((state) => ({
//             foods: state.foods.map((f) => (f.id === food.id ? food : f)),
//         }));
//     },
//     handleClose: () => set({opened: false, selectedFood: {} as Food}),
//     foods: [],
//     addFood: (food: Food) => set((state) => ({foods: [...state.foods, food]})),
//     deleteFood: (foodID: number) =>
//         set((state) => ({foods: state.foods.filter((f) => f.id !== foodID)})),
// }));
const addItemsFromLocalStorage = async () => {
    const localStorageKeys = Object.keys(localStorage);
    for (const key of localStorageKeys) {
        const item = localStorage.getItem(key);
        if (item !== null) {
            const food = JSON.parse(item);
            try {
                await axios.post(`${config.SERVER_URL}/api/reviews`, food);
                localStorage.removeItem(key);
            } catch (error) {
                console.error('Error adding food:', error);
            }
        }
    }
};

const startSyncProcess = () => {
    setInterval(async () => {
        await useFoodStore.getState().checkInternetStatus();
        const {isOnline} = useFoodStore.getState();
        if (isOnline) {
            await addItemsFromLocalStorage();
        }
    }, 5000); // Check every 5 seconds
};
startSyncProcess();

const useFoodStore = create<useFoodStoreProps>((set) => ({
    isOnline: true,
    checkInternetStatus: async () => {
        try {
            const response = await axios.get(
                `${config.SERVER_URL}/api/check-internet`,
            );
            set({isOnline: response.data.isOnline});
        } catch (error) {
            set({isOnline: false}); // If there's an error, assume offline
        }
    },
    opened: false,
    selectedFood: {} as Food,
    handleOpen: (food?: Food) => set({opened: true, selectedFood: food}),
    editFood: async (food: FoodReview) => {
        const authToken = getAuthToken(); // Get the token from cookies
        const headers = authToken ? {Authorization: authToken} : {};

        await useFoodStore.getState().checkInternetStatus();
        const {isOnline} = useFoodStore.getState();
        if (isOnline) {
            try {
                await axios.put(
                    `${config.SERVER_URL}/api/reviews/${food.ReviewID}`,
                    food,
                    {headers},
                );
                fetchFoods();
                set((state) => ({
                    foods: state.foods.map((f) =>
                        f.ReviewID === food.ReviewID ? food : f,
                    ),
                }));
            } catch (error) {
                console.error('Error updating review:', error);
                throw error;
            }
        } else {
            localStorage.setItem(
                food.ReviewID.toString(),
                JSON.stringify(food),
            );
            set((state) => ({
                foods: state.foods.map((f) =>
                    f.ReviewID === food.ReviewID ? food : f,
                ),
            }));
        }
    },
    handleClose: () => set({opened: false, selectedFood: {} as Food}),
    foods: [],
    addFood: async (food: Food) => {
        const authToken = getAuthToken(); // Get the token from cookies
        const headers = authToken ? {Authorization: authToken} : {};

        await useFoodStore.getState().checkInternetStatus();
        const {isOnline} = useFoodStore.getState();
        if (isOnline) {
            try {
                await axios.post(`${config.SERVER_URL}/api/reviews`, food, {
                    headers,
                });
                // Fetch updated data after successful deletion
                fetchFoods();
                set((state) => ({foods: [...state.foods, food]}));
            } catch (error) {
                console.error('Error deleting food:', error);
                throw error;
            }
        } else {
            localStorage.setItem(food.FoodID.toString(), JSON.stringify(food));
            set((state) => ({foods: [...state.foods, food]}));
        }
    },

    deleteFood: async (foodID: number) => {
        const authToken = getAuthToken(); // Get the token from cookies
        const headers = authToken ? {Authorization: authToken} : {};

        await useFoodStore.getState().checkInternetStatus();
        const {isOnline} = useFoodStore.getState();
        if (isOnline) {
            try {
                await axios.delete(
                    `${config.SERVER_URL}/api/reviews/${foodID}`,
                    {headers},
                );
                // Fetch updated data after successful deletion
                set((state) => ({
                    foods: state.foods.filter((f) => f.ReviewID !== foodID),
                }));
                fetchFoods();
            } catch (error) {
                console.error('Error deleting food:', error);
            }
        } else {
            localStorage.removeItem(foodID.toString());
            set((state) => ({
                foods: state.foods.filter((f) => f.ReviewID !== foodID),
            }));
        }
    },
}));

export default useFoodStore;
