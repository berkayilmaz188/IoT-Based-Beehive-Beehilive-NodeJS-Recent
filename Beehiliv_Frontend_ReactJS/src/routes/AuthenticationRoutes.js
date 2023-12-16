import { lazy } from 'react';
import { useParams } from 'react-router-dom';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));
const PasswordReset3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/PasswordReset3')));
const SetNewPassword3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/SetNewPassword3')));
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/login',
            element: <AuthLogin3 />
        },
        {
            path: '/register',
            element: <AuthRegister3 />
        },
        {
            path: '/default',
            element: <DashboardDefault />
        },
        {
            path: '/forgotpassword',
            element: <PasswordReset3 />
        },
        {
            path: '/passwordreset/:token',
            element: <SetNewPassword3 />
        }
    ]
};

export default AuthenticationRoutes;
