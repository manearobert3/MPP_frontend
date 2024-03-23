import {create} from 'zustand';

import foodList from './FoodList';
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

const useFoodStore = create<useFoodStoreProps>((set) => ({
    opened: false,
    selectedFood: {} as Food,
    handleOpen: (food?: Food) => set({opened: true, selectedFood: food}),
    editFood: (food: Food) => {
        set((state) => ({
            foods: state.foods.map((f) => (f.id === food.id ? food : f)),
        }));
    },
    handleClose: () => set({opened: false, selectedFood: {} as Food}),
    foods: foodList,
    addFood: (food: Food) => set((state) => ({foods: [...state.foods, food]})),
    deleteFood: (foodID: number) =>
        set((state) => ({foods: state.foods.filter((f) => f.id !== foodID)})),
}));

export default useFoodStore;
