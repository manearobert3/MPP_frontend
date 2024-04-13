import {Suspense, lazy} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import Add from './Add';
import Chart from './Chart';
import AddReview from './newEntity/AddReview';
const Routing = () => {
    const Overview = lazy(() => import('./Overview'));
    const Detail = lazy(() => import('./Detail'));
    const Edit = lazy(() => import('./Edit'));
    const OverviewReview = lazy(() => import('./newEntity/newEntityOverview'));
    const DetailReview = lazy(() => import('./newEntity/DetailReview'));
    const EditReview = lazy(() => import('./newEntity/EditReview'));
    return (
        <Suspense fallback={<></>}>
            <Routes>
                <Route path='/' element={<Navigate replace to='/foods' />} />
                <Route element={<Overview />} path={'/foods'} />
                <Route element={<Detail />} path={'/foods/:id'} />
                <Route element={<Edit />} path={'/foods/edit/:id'} />
                <Route element={<Add />} path={'/foods/add'} />
                <Route element={<Chart />} path={'/foods/chart'} />
                <Route element={<OverviewReview />} path={'/review'} />
                <Route element={<DetailReview />} path={'/review/:id'} />
                <Route element={<EditReview />} path={'/review/edit/:id'} />
                <Route element={<AddReview />} path={'/review/add'} />
            </Routes>
        </Suspense>
    );
};

export default Routing;
