import { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Add from './Add';
import './App.css';
import FirstPage from './FirstPage';
import { Update } from './Update';

export default function MyForm() {
    const [food, setFood] = useState<FoodItem[]>([
        {
            id: 0,
            name: 'Bruger',
            kcal: '1234',
            fats: '12',
        },
        {
            id: 1,
            name: 'Apperitives',
            kcal: '23',
            fats: '13',
        },
        {
            id: 2,
            name: 'desert',
            kcal: '60',
            fats: '14',
        },
    ]);
    const addFoodItem = (item: FoodItem) => {
        setFood([...food, item]);
    };
    return (
        // <div className='App'>
        <>
            <Link to='/update'>
                <button>Update</button>
            </Link>
            <Link to='/'>
                <button>FirstPage</button>
            </Link>
            <Link to='/add'>
                <button>Add</button>
            </Link>
            <Routes>
                <Route path='/' element={<FirstPage />}>
                    <Route path='/update' element={<Update />} />
                    <Route
                        path='/add'
                        element={
                            // <FoodContext.Provider value={food}>
                            //     <Add food={food} />
                            // </FoodContext.Provider>
                            <FoodContext.Provider
                                value={{foodList: food, addFoodItem}}
                            >
                                <Add />
                            </FoodContext.Provider>
                        }
                    />
                </Route>
                {/* <Route path='/add' element={<Add />} /> */}
            </Routes>
        </>
    );
}
