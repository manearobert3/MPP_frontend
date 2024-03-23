import {StyledEngineProvider} from '@mui/material/styles';
import {BrowserRouter} from 'react-router-dom';
import Routing from './Routing';
const App = () => {
    return (
        <StyledEngineProvider injectFirst>
            <BrowserRouter>
                <Routing />
            </BrowserRouter>
        </StyledEngineProvider>
    );
};

export default App;
