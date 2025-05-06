import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/Layout/DashboardLayout';
import UserHome from './pages/PublicDashboard/UserHome';
import { publicRoutes, privateRoutes } from './routes';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider } from './routes/AuthContext';
import Login from './pages/General/Login';
import Register from './pages/General/Register';
import MovieDetail from './pages/PublicDashboard/MovieDetail';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Route trang chủ */}
                    <Route path="/" element={<UserHome />} />

                    {/* Route chi tiết phim */}
                    <Route path="/movie/:movieId" element={<MovieDetail />} />

                    {/* Các public routes khác (nếu cần) */}
                    {publicRoutes
                        .filter(
                            (route) =>
                                route.path !== '/' &&
                                route.path !== '/movie/:movieId',
                        )
                        .map(({ path, component: Page }, index) => (
                            <Route key={index} path={path} element={<Page />} />
                        ))}

                    {/* Private Routes */}
                    {privateRoutes.map(
                        ({ path, component: Page, role, title}, index) => (
                            <Route
                                key={index}
                                path={path}
                                element={
                                    <PrivateRoute
                                        role={role}
                                        title={title}
                                        element={
                                            <DashboardLayout>
                                                <Page />
                                            </DashboardLayout>
                                        }
                                    />
                                }
                            />
                        ),
                    )}
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
