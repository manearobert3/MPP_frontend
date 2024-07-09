import Cookies from 'js-cookie';

const getAuthToken = () => {
    const token = Cookies.get('_auth');
    const tokenType = Cookies.get('_auth_type');
    if (token && tokenType) {
        return `${tokenType} ${token}`;
    }
    return null;
};

export default getAuthToken;
