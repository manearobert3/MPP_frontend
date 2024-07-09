import AuthOutlet from '@auth-kit/react-router/AuthOutlet';
import {Suspense, lazy} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import styled from 'styled-components';
import Add from './Add';
import Chart from './Chart';
import MealPlan from './MealPlan';
import ResponsiveAppBar from './NavBar';
import AddReview from './newEntity/AddReview';
import EditCurrentUser from './userTabel/EditCurrentUser';
const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    min-height: 100vh;
    z-index: 0;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('src/assets/foodie.jpg');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        opacity: 0.4; /* Adjust the opacity here */
        z-index: -1;
    }
`;

const ContentWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const Routing = () => {
    const Overview = lazy(() => import('./Overview'));
    const Detail = lazy(() => import('./Detail'));
    const Edit = lazy(() => import('./Edit'));
    const OverviewReview = lazy(() => import('./newEntity/newEntityOverview'));
    const DetailReview = lazy(() => import('./newEntity/DetailReview'));
    const EditReview = lazy(() => import('./newEntity/EditReview'));
    const JoinedTables = lazy(() => import('./newMultipleEntities/Overview'));
    const FoodAndReview = lazy(() => import('./FoodAndReview'));
    const Login = lazy(() => import('./Login'));
    const Register = lazy(() => import('./Register'));
    const OverviewUsers = lazy(() => import('./userTabel/OverviewUsers'));
    const AddUser = lazy(() => import('./userTabel/AddUser'));
    const EditUser = lazy(() => import('./userTabel/EditUser'));
    const Tracker = lazy(() => import('./Tracker'));
    return (
        <Suspense fallback={<></>}>
            <AppContainer>
                <ResponsiveAppBar />
                <ContentWrapper>
                    <Routes>
                        <Route element={<AuthOutlet fallbackPath='/login' />}>
                            <Route
                                path='/'
                                element={<Navigate replace to='/foods' />}
                            />
                            <Route element={<Overview />} path={'/foods'} />
                            <Route
                                element={<FoodAndReview />}
                                path={'/foodandreview/:id'}
                            />
                            <Route path='/tracker' element={<Tracker />} />

                            <Route
                                element={<OverviewUsers />}
                                path={'/users'}
                            />
                            <Route element={<AddUser />} path={'/users/add'} />

                            <Route
                                element={<EditUser />}
                                path={'/users/edit/:UserName'}
                            />
                            <Route element={<MealPlan />} path={'/mealPlan'} />
                            <Route
                                element={<EditCurrentUser />}
                                path={'/users/edit/currentUser'}
                            />

                            <Route element={<Detail />} path={'/foods/:id'} />
                            <Route
                                element={<Edit />}
                                path={'/foods/edit/:id'}
                            />
                            <Route element={<Add />} path={'/foods/add'} />
                            <Route element={<Chart />} path={'/foods/chart'} />
                            <Route
                                element={<OverviewReview />}
                                path={'/review'}
                            />
                            <Route
                                element={<DetailReview />}
                                path={'/review/:id'}
                            />
                            <Route
                                element={<EditReview />}
                                path={'/review/edit/:id'}
                            />
                            <Route
                                element={<AddReview />}
                                path={'/review/add/:id'}
                            />
                            <Route
                                element={<JoinedTables />}
                                path={'/joinedTables'}
                            />
                        </Route>
                        <Route element={<Login></Login>} path={'/login'} />
                        <Route
                            element={<Register></Register>}
                            path={'/register'}
                        />
                    </Routes>
                </ContentWrapper>
            </AppContainer>
        </Suspense>
    );
};

export default Routing;
