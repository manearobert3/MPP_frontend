import {useState} from 'react';
import './AddFoodStyle.css';
import {FoodProps} from './food_props';

type Props = {
    onBackButClick: () => void;
    onSubmitClick: (data: FoodProps) => void;
};

const AddFood = (props: Props) => {
    const [foodName, setFoodName] = useState('');
    const [kcal, setKcal] = useState('');
    const [fats, setFats] = useState('');
    const {onBackButClick, onSubmitClick} = props;

    const onFoodNameChange = (e: any) => {
        setFoodName(e.target.value);
    };
    const onKCalChange = (e: any) => {
        setKcal(e.target.value);
    };
    const onFatsChange = (e: any) => {
        setFats(e.target.value);
    };

    const onSubmitClickFunc = (e: any) => {
        e.preventDefault();
        if (!/^[a-zA-Z]+$/.test(foodName)) {
            alert('Name must contain only letters');
            return;
        }

        // Validation: Check if kcal and fats are greater than 0
        const kcalValue = parseFloat(kcal);
        const fatsValue = parseFloat(fats);
        if (
            isNaN(kcalValue) ||
            kcalValue <= 0 ||
            isNaN(fatsValue) ||
            fatsValue <= 0
        ) {
            alert('Kcal and fats must be valid positive numbers');
            return;
        }
        const data: FoodProps = {
            id: Math.floor(Math.random() * (9999 - 1) + 1),
            name: foodName,
            kcal: kcal,
            fats: fats,
        };
        onSubmitClick(data);
        onBackButClick();
    };
    return (
        <>
            <div className='form-container'>
                <h1>Add Food:</h1>

                <form onSubmit={onSubmitClickFunc}>
                    <div>
                        <label>Name</label>
                        <input
                            type='text'
                            value={foodName}
                            onChange={onFoodNameChange}
                        ></input>
                    </div>
                    <div>
                        <label>Calories</label>
                        <input
                            type='text'
                            value={kcal}
                            onChange={onKCalChange}
                        ></input>
                    </div>
                    <div>
                        <label>Fats</label>
                        <input
                            type='text'
                            value={fats}
                            onChange={onFatsChange}
                        ></input>
                    </div>
                    <div>
                        <input
                            type='button'
                            value='Back'
                            onClick={onBackButClick}
                        />
                        <input type='submit' value='Add Food' />
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddFood;
