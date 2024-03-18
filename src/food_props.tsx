export interface FoodProps {
    id: number;
    name: string;
    kcal: string;
    fats: string;
}

export const testFoodList: FoodProps[] = [
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

export enum PageEnum {
    list,
    add,
    edit,
}
