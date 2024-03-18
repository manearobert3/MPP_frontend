import './FoodViewStyle.css';
import {FoodProps} from './food_props';

type Props = {
    onClose: () => void;
    data: FoodProps;
};

const FoodView = (props: Props) => {
    const {onClose, data} = props;
    return (
        <div id='myModal' className='modal'>
            <div className='modal-content'>
                <span className='close' onClick={onClose}>
                    &times;
                </span>
                <div>
                    <h3>Food Data:</h3>
                    <div>
                        <div>
                            <label>Name: {data.name}</label>
                        </div>
                        <div>
                            <label>KCalories: {data.kcal}</label>
                        </div>
                        <div>
                            <label>Fats: {data.fats}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodView;
