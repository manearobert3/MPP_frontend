import {create} from 'zustand';

import {default as Axios, default as axios} from 'axios';
import Food from './Interface';
interface useFoodStoreProps {
    opened: boolean;
    handleOpen: (food?: Food) => void;
    handleClose: () => void;
    foods: Food[];
    deleteFood: (foodID: number) => void;
    addFood: (food: Food) => void;
    selectedFood: Food;
    editFood: (food: Food) => void;
}
Axios.get<Food[]>('http://localhost:5050/api/foods/')
    .then((response) => {
        useFoodStore.setState({foods: response.data});
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });
const fetchFoods = async () => {
    try {
        const response = await axios.get<Food[]>(
            'http://localhost:5050/api/foods/',
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

const useFoodStore = create<useFoodStoreProps>((set) => ({
    opened: false,
    selectedFood: {} as Food,
    handleOpen: (food?: Food) => set({opened: true, selectedFood: food}),
    editFood: async (food: Food) => {
        try {
            await axios.put(`http://localhost:5050/api/foods/${food.id}`, food);
            fetchFoods();
        } catch (error) {
            console.error('Error updating food:', error);
        }
        set((state) => ({
            foods: state.foods.map((f) => (f.id === food.id ? food : f)),
        }));
        fetchFoods();
    },
    handleClose: () => set({opened: false, selectedFood: {} as Food}),
    foods: [],
    addFood: async (food: Food) => {
        try {
            await axios.post(`http://localhost:5050/api/foods/`, food);
            // Fetch updated data after successful deletion
            fetchFoods();
        } catch (error) {
            console.error('Error deleting food:', error);
        }
        set((state) => ({foods: [...state.foods, food]}));
    },

    deleteFood: async (foodID: number) => {
        try {
            await axios.delete(`http://localhost:5050/api/foods/${foodID}`);
            // Fetch updated data after successful deletion
            fetchFoods();
        } catch (error) {
            console.error('Error deleting food:', error);
        }

        set((state) => ({
            foods: state.foods.filter((f) => f.id !== foodID),
        }));
    },
}));

export default useFoodStore;
