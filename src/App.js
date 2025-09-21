import { Route, HashRouter as Router, Routes, useNavigate, useLocation } from 'react-router-dom';
import './assets/scss/global.css';
import { AppHeader } from './cmps/AppHeader';
import { Toaster } from './components/ui/toaster';
import { lazy, Suspense, useEffect } from 'react';
import { LoadingProvider } from './cmps/LoadingContext';
import LazyLoading from './cmps/LazyLoading';
import { utilService } from './services/util.service';
import { disableReactDevTools } from '@fvilers/disable-react-devtools'
import ProtectedRoute from './cmps/ProtectedRoute';
import { requestFirebaseToken, onMessageListener } from './services/firebase';
import ScrollToTopCmp from './cmps/helpers/ScrollToTopCmp';
import { ToastContainer, toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeysService } from './services/queryKeys.service';
import BusinessesData from './views/BusinessesData';
import CampaignDetails from './views/CampaignDetails';
import Sidebar from './cmps/layout/Sidebar';
import clsx from 'clsx';
import RouteHeader from './cmps/appHeader/RouteHeader';
import { useMediaQuery } from '@mui/material';
import AddNewTask from './views/AddNewTask';

if (process.env.REACT_APP_NODE_ENV === 'production') {
    disableReactDevTools()
}


const Login = lazy(() => import("./views/Login"))
const ProblemProductsPage = lazy(() => import("./views/ProblemProductsPage"))
const NotFound = lazy(() => import("./views/NotFound"))
const ManageEmployees = lazy(() => import("./views/ManageEmployees"))
const Tasks = lazy(() => import("./views/Tasks"))
const ManageDepartments = lazy(() => import("./views/ManageDepartments"))
const ManageSubDepartment = lazy(() => import("./views/ManageSubDepartment"))
const ManageTaskStatuses = lazy(() => import("./views/ManageTaskStatuses"))
const MarkerProducts = lazy(() => import("./views/MarkerProducts"))
const WorlLogsByTicketID = lazy(() => import("./views/WorlLogsByTicketID"))
const ManageEmployeeStatuses = lazy(() => import("./views/ManageEmployeeStatuses"))
const Statistics = lazy(() => import("./views/Statistics"))
const ManageTaskPriorityLevels = lazy(() => import("./views/ManageTaskPriorityLevels"))
const ManageTaskTypes = lazy(() => import("./views/ManageTaskTypes"))
const ManageUserTypes = lazy(() => import("./views/ManageUserTypes"))
const ManageBusinesses = lazy(() => import("./views/ManageBusinesses"))
const RealTimeWorking = lazy(() => import("./views/RealTimeWorking"))
const LandingPage = lazy(() => import("./views/LandingPage"))
const Logs = lazy(() => import("./views/Logs"))
const Campaigns = lazy(() => import("./views/Campaigns"))

const routes = [
    { path: '/', element: <Login />, name: 'Login' },
    { path: '/tasks', element: < ProtectedRoute allowedRoles={['3', '4', '5', '6']}><Tasks /></ProtectedRoute>, name: 'Tasks' },
    { path: '/campaign/details', element: < ProtectedRoute allowedRoles={['3', '4', '5', '6']}><CampaignDetails /></ProtectedRoute>, name: 'Tasks' },
    { path: '/real-time-work', element: < ProtectedRoute allowedRoles={['3', '4', '5', '7']}><RealTimeWorking /></ProtectedRoute>, name: 'Real-Time Work' },
    { path: '/reports', element: < ProtectedRoute allowedRoles={['3', '5', '4']}><Logs /></ProtectedRoute>, name: 'Reports' },
    { path: '/reports/by-ticket-id', element: < ProtectedRoute allowedRoles={['3', '5', '4']}><WorlLogsByTicketID /></ProtectedRoute>, name: 'Reports by Ticket ID' },
    { path: '/departments', element: < ProtectedRoute allowedRoles={['3']}><ManageDepartments /></ProtectedRoute>, name: 'Manage Departments' },
    { path: '/campaigns', element: < ProtectedRoute allowedRoles={['3', '4', '5']}><Campaigns /></ProtectedRoute>, name: 'Manage Campaigns' },
    { path: '/departments/sub', element: < ProtectedRoute allowedRoles={['3']}><ManageSubDepartment /></ProtectedRoute>, name: 'Manage Sub-Departments' },

    // User
    { path: '/users', element: < ProtectedRoute allowedRoles={['3']}> <ManageEmployees /></ProtectedRoute>, name: 'Manage Employees' },
    { path: '/create', element: < ProtectedRoute allowedRoles={['3', '5', '4']}> <AddNewTask /></ProtectedRoute>, name: 'Manage Employees' },
    { path: '/user/types', element: < ProtectedRoute allowedRoles={['3']}>  <ManageUserTypes /></ProtectedRoute>, name: 'Manage Employees types' },

    // Statuses
    { path: 'task/statuses', element: < ProtectedRoute allowedRoles={['3']}><ManageTaskStatuses /></ProtectedRoute>, name: 'Task Statuses' },
    { path: '/user/statuses', element: < ProtectedRoute allowedRoles={['3']}><ManageEmployeeStatuses /></ProtectedRoute>, name: 'Employee Statuses' },

    // Statistics and Reports
    // { path: '/statistics', element: < ProtectedRoute allowedRoles={['3', '5', '4']}><Statistics /></ProtectedRoute>, name: 'Statistics' },
    // { path: '/businesses-data', element: < ProtectedRoute allowedRoles={['3', '10']}><BusinessesData /></ProtectedRoute>, name: 'Businesses' },

    // Task Configurations
    { path: '/task/priority-levels', element: < ProtectedRoute allowedRoles={['3']}><ManageTaskPriorityLevels /></ProtectedRoute>, name: 'Task Priority Levels' },
    { path: '/task/types', element: < ProtectedRoute allowedRoles={['3']}><ManageTaskTypes /></ProtectedRoute>, name: 'Task Types' },

    // Businesses
    // { path: '/businesses', element: < ProtectedRoute allowedRoles={['3']}><ManageBusinesses /></ProtectedRoute>, name: 'Manage Businesses' },
    // { path: '/home', element: <LandingPage />, name: 'Home page' },

    { path: '/task/products', element: <MarkerProducts />, name: 'Sheet Products' },
    { path: '/task/stuck-products', element: <ProblemProductsPage />, name: 'Error Products' },




    { path: '*', element: <NotFound />, name: 'Not Found' },
];

function MainApp() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const isAuthRoute = location.pathname === "/";
    const isAtLeastSm = useMediaQuery("(min-width: 640px)");
    const showRouteHeader = !isAuthRoute && isAtLeastSm;

    useEffect(() => {
        utilService.updateDocumentTitle(location);
    }, [location, navigate]);

    useEffect(() => {
        // Request the Firebase token when the component mounts
        requestFirebaseToken();

        // Set up the onMessage listener with a callback
        const unsubscribe = onMessageListener((payload) => {
            // console.log("payload", payload);
            queryClient.invalidateQueries({ queryKey: [queryKeysService.DASHBOARD] });

            // Extract notification details
            const { notification } = payload;
            console.log("notification", notification);
            console.log("payload", payload);
            if (notification) {
                const { title, body } = notification;

                // Show a toast notification with an icon
                toast.info(() => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div>
                            <strong>{title}</strong>
                        </div>
                    </div>
                ), {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }


        });

        // Clean up the listener when the component unmounts
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div className="flex min-h-screen">             {/* row, not column */}
            {!isAuthRoute && <Sidebar />}                 {/* fixed, w‑64 */}

            {/* ------------------ MAIN COLUMN ------------------ */}
            <div
                className={clsx("flex flex-1 flex-col min-w-0", { "lg:pl-64": !isAuthRoute })}
                style={{ ['--stack-offset']: !isAuthRoute ? '112px' : '0px' }}
            >
                {showRouteHeader && <RouteHeader />}
                {!isAuthRoute && <AppHeader />}

                <main className="flex-1 overflow-auto">     {/* vertical + horizontal scroll */}
                    <Suspense fallback={<LazyLoading />}>
                        <Routes>
                            {routes.map(({ path, element }) => (
                                <Route key={path} path={path} element={element} />
                            ))}
                        </Routes>
                    </Suspense>
                </main>

                <Toaster />
            </div>
        </div>
    );
}

function App() {
    return (
        <LoadingProvider>
            <Router>
                <MainApp />
            </Router>
        </LoadingProvider>
    );
}

export default App;
