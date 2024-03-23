import {Suspense, lazy} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import Add from './Add';

const Routing = () => {
    const Overview = lazy(() => import('./Overview'));
    const Detail = lazy(() => import('./Detail'));
    const Edit = lazy(() => import('./Edit'));

    return (
        <Suspense fallback={<></>}>
            <Routes>
                <Route path='/' element={<Navigate replace to='/foods' />} />
                <Route element={<Overview />} path={'/foods'} />
                <Route element={<Detail />} path={'/foods/:id'} />
                <Route element={<Edit />} path={'/foods/edit/:id'} />
                <Route element={<Add />} path={'/foods/add'} />
            </Routes>
        </Suspense>
    );
};

export default Routing;
