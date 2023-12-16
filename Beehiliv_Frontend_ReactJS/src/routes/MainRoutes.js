// MainRoutes.js
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { clearStorageAndRedirect, isAuthenticated, isTokenExpired, isTokenValid } from '../helpers/auth';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Profile from 'views/utilities/Typography';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const MainDashboardDefault = Loadable(lazy(() => import('views/dashboard/Default/mainindex')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// Giriş yapmış kullanıcılar için yönlendirme:
const ProtectedRoute = ({ children }) => {
    if (isAuthenticated()) {
        if (!isTokenValid()) {
            clearStorageAndRedirect();
            return null;
        } else {
            return children;
        }
    } else {
        return <Navigate to="/login" />;
    }
};

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <ProtectedRoute>
                          <MainDashboardDefault />
                      </ProtectedRoute>
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <MainDashboardDefault />
                }
            ]
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'hive',
                    element: <DashboardDefault />
                }
            ]
        },
        {
            path: 'user',
            children: [
                {
                    path: 'profile',
                    element: <Profile />
                },
                {
                    path: 'util-color',
                    element: <UtilsColor />
                },
                {
                    path: 'util-shadow',
                    element: <UtilsShadow />
                }
            ]
        },
        {
            path: 'icons',
            children: [
                {
                    path: 'tabler-icons',
                    element: <UtilsTablerIcons />
                },
                {
                    path: 'material-icons',
                    element: <UtilsMaterialIcons />
                }
            ]
        },
        {
            path: 'sample-page',
            element: <SamplePage />
        }
    ]
};

export default MainRoutes;
