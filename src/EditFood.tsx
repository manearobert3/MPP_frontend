import {useState} from 'react';
import './AddFoodStyle.css';
import {FoodProps} from './food_props';
type Props = {
    list: FoodProps[];
    data: FoodProps;
    onBackButClick: () => void;
    onUpdateClick: (data: FoodProps) => void;
};

const EditFood = (props: Props) => {
    const {list, data, onBackButClick, onUpdateClick} = props;
    const [foodName, setFoodName] = useState(data.name);
    const [kcal, setKcal] = useState(data.kcal);
    const [fats, setFats] = useState(data.fats);

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
        // const foodExists = list.some(
        //     (food: FoodProps) =>
        //         food.name === foodName &&
        //         food.fats === fats &&
        //         food.kcal === kcal,
        // );

        // if (foodExists) {
        //     // Food with the same name already exists, display a message or prevent the update
        //     alert('Food with this name already exists!');
        //     return;
        // } else {
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

        const updateData: FoodProps = {
            id: data.id,
            name: foodName,
            kcal: kcal,
            fats: fats,
        };
        onUpdateClick(updateData);
        onBackButClick();
        // }
    };
    return (
        <div className='form-container'>
            <h1>Edit Food:</h1>

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
                    <input type='submit' value='Update Food' />
                </div>
            </form>
        </div>
    );
};

export default EditFood;
