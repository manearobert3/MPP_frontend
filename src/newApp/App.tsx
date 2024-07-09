import {StyledEngineProvider} from '@mui/material/styles';
import AuthProvider from 'react-auth-kit';
import createStore from 'react-auth-kit/createStore';
import {BrowserRouter} from 'react-router-dom';
import Routing from './Routing';
import './style.css';
interface IUserData {
    name: string;
}

const App = () => {
    const store = createStore<IUserData>({
        authName: '_auth',
        authType: 'cookie',
        cookieDomain: window.location.hostname,
        cookieSecure: false,
    });
    return (
        <StyledEngineProvider injectFirst>
            <AuthProvider store={store}>
                <BrowserRouter>
                    <Routing />
                </BrowserRouter>
            </AuthProvider>
        </StyledEngineProvider>
    );
};

export default App;
