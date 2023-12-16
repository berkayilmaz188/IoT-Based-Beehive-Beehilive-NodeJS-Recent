export const isAuthenticated = () => {
    const token = localStorage.getItem('jwt_token');
    return token !== null;
};

export const isTokenExpired = () => {
    const token = localStorage.getItem('jwt_token');

    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        return payload.exp < currentTime;
    }

    return true;
};

export const isTokenValid = () => {
    const token = localStorage.getItem('jwt_token');

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload && typeof payload.exp === 'number';
        } catch (error) {
            return false;
        }
    }

    return false;
};

export const clearStorageAndRedirect = () => {
    localStorage.clear();
    window.location.href = '/login';
};