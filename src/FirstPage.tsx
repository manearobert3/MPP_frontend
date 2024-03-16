import {useState} from 'react';

let nextID = 3;
const food = [
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
];

export default function FirstPage() {
    const [list, setList] = useState(food);
    const [name, setName] = useState('');
    const [kcal, setKcal] = useState('');
    const [fats, setFats] = useState('');
    const handleAdd = () => {
        // Validate inputs
        if (!name || isNaN(Number(kcal)) || isNaN(Number(fats))) {
            alert('Please enter a valid name and numeric kcal and fats value.');
            return;
        }

        // Add new item to list
        setList([
            ...list,
            {
                id: nextID++,
                name: name,
                kcal: kcal,
                fats: fats,
            },
        ]);
    };
    return (
        <>
            <h1>Input Foods:</h1>
            <p>
                Input Name of Food:
                <input
                    id='input'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </p>

            <p>
                Input KCal of Food:
                <input
                    id='input'
                    value={kcal}
                    onChange={(e) => setKcal(e.target.value)}
                />
            </p>
            <p>
                Input fats of Food:
                <input
                    id='input'
                    value={fats}
                    onChange={(e) => setFats(e.target.value)}
                />
            </p>

            <button onClick={handleAdd}>Add</button>
            <br></br>
            {list.map((food) => (
                <li key={food.id}>
                    {food.name},{food.kcal},{food.fats}
                </li>
            ))}
        </>
    );
}
