import {useState} from 'react';
import FoodView from './FoodView';
import './TableStyle.css';
import {FoodProps} from './food_props';

type Props = {
    list: FoodProps[];
    onDeleteClickHandler: (data: FoodProps) => void;
    onEdit: (data: FoodProps) => void;
};
const Show = (props: Props) => {
    const {list, onDeleteClickHandler, onEdit} = props;
    const [showView, setShowView] = useState(false);
    const [foodToView, setFoodToView] = useState(null as FoodProps | null);
    const viewFood = (data: FoodProps) => {
        setFoodToView(data);
        setShowView(true);
    };
    const onCloseView = () => {
        setShowView(false);
    };
    return (
        <div>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Calories</th>
                    <th>Actions</th>
                </tr>
                {list.map((food) => {
                    return (
                        <tr key={food.id}>
                            <td>{food.name}</td>
                            <td>{food.kcal}</td>
                            <td>
                                <div>
                                    <input
                                        type='button'
                                        value='View'
                                        onClick={() => viewFood(food)}
                                    />
                                    <input
                                        type='button'
                                        value='Edit'
                                        onClick={() => onEdit(food)}
                                    />
                                    <input
                                        type='button'
                                        value='Delete'
                                        onClick={() =>
                                            onDeleteClickHandler(food)
                                        }
                                    />
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </table>
            {showView && foodToView !== null && (
                <FoodView onClose={onCloseView} data={foodToView} />
            )}
        </div>
    );
};

export default Show;
