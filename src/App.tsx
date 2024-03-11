import './App.css';

const food = [
    {
        id: 0,
        name: 'Bruger',
        kcal: '1234',
    },
    {
        id: 1,
        name: 'aaa',
        kcal: '23',
    },
    {
        id: 2,
        name: 'desert',
        kcal: '60',
    },
];

// class Food extends Component {
//     string name;
//     render() {
//         return <h1>Food Name: {this.props.name}</h1>;
//     }
// }

export default function App() {
    const listItems = food.map((food) => (
        <li>
            <p>
                <b>{food.id}:</b>
                {food.name + ', '}
                with exactly Kcal: {food.kcal}
            </p>
        </li>
    ));
    return <ul>{listItems}</ul>;
}
