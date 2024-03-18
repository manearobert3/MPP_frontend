import {useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import AddFood from './AddFood';
import EditFood from './EditFood';
import Show from './Show';
import {FoodProps, PageEnum, testFoodList} from './food_props';

const Home = () => {
    const [foodList, setFoodList] = useState(testFoodList as FoodProps[]);

    const [shownPage, setShownPage] = useState(PageEnum.list);
    const [dataToEdit, setDataToEdit] = useState({} as FoodProps);

    useEffect(() => {
        const listString = window.localStorage.getItem('foodList');
        if (listString) {
            _setFoodList(JSON.parse(listString));
        }
    }, []);

    const _setFoodList = (list: FoodProps[]) => {
        setFoodList(list);
        window.localStorage.setItem('foodList', JSON.stringify(list));
    };

    const onAddFoodClick = () => {
        setShownPage(PageEnum.add);
        window.location.href = '/add';
    };
    const showListPage = () => {
        window.location.href = '/';
        setShownPage(PageEnum.list);
    };
    const addFood = (data: FoodProps) => {
        _setFoodList([...foodList, data]);
        window.location.href = '/';
    };

    const deleteFood = (data: FoodProps) => {
        const indexToDelete = foodList.indexOf(data);
        const auxList = [...foodList];

        auxList.splice(indexToDelete, 1);
        _setFoodList(auxList);
    };
    const editFoodData = (data: FoodProps) => {
        setShownPage(PageEnum.edit);

        setDataToEdit(data);
    };

    const updateData = (data: FoodProps) => {
        const filteredData = foodList.filter((x) => x.id === data.id)[0];
        const indexOfFood = foodList.indexOf(filteredData);
        const auxList = [...foodList];
        auxList[indexOfFood] = data;
        _setFoodList(auxList);
    };
    //     return (
    //         <>
    //             <article className='article-header'>
    //                 <header>
    //                     <h1>CRUD App</h1>
    //                 </header>
    //             </article>
    //             <section className='section-content'>
    //                 {shownPage === PageEnum.list && (
    //                     <>
    //                         <input
    //                             type='button'
    //                             value='Add Food'
    //                             onClick={onAddFoodClick}
    //                         />
    //                         <Show
    //                             list={foodList}
    //                             onDeleteClickHandler={deleteFood}
    //                             onEdit={editFoodData}
    //                         />
    //                     </>
    //                 )}

    //                 {shownPage === PageEnum.add && (
    //                     <AddFood
    //                         onBackButClick={showListPage}
    //                         onSubmitClick={addFood}
    //                     />
    //                 )}

    //                 {shownPage === PageEnum.edit && (
    //                     <EditFood
    //                         list={foodList}
    //                         data={dataToEdit}
    //                         onBackButClick={showListPage}
    //                         onUpdateClick={updateData}
    //                     />
    //                 )}
    //             </section>
    //         </>
    //     );
    // };
    return (
        <>
            <article className='article-header'>
                <header>
                    <h1>CRUD App</h1>
                </header>
            </article>
            <BrowserRouter>
                <section className='section-content'>
                    <Routes>
                        {' '}
                        {/* Use Routes instead of Switch */}
                        <Route
                            path='/'
                            element={
                                // Use element prop to specify component
                                <>
                                    <input
                                        type='button'
                                        value='Add Food'
                                        onClick={onAddFoodClick}
                                    />
                                    <Show
                                        list={foodList}
                                        onDeleteClickHandler={deleteFood}
                                        onEdit={editFoodData}
                                    />
                                </>
                            }
                        />
                        <Route
                            path='/add'
                            element={
                                <AddFood
                                    onBackButClick={showListPage}
                                    onSubmitClick={addFood}
                                />
                            }
                        />{' '}
                        {/* Define route for AddFood component */}
                    </Routes>
                </section>
            </BrowserRouter>
            <div>
                {shownPage === PageEnum.edit && (
                    <EditFood
                        list={foodList}
                        data={dataToEdit}
                        onBackButClick={showListPage}
                        onUpdateClick={updateData}
                    />
                )}
            </div>
        </>
    );
};

export default Home;
