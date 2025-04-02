import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/Layout/DashboardLayout';
import UserHome from './pages/PublicDashboard/UserHome';
import { publicRoutes, privateRoutes } from './routes';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider } from './routes/AuthContext';
import Login from './pages/General/Login';
import Register from './pages/General/Register';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Public Routes */}
                    {publicRoutes.map(({ path, component: Page }, index) => (
                        <Route
                            key={index}
                            path={path}
                            element={
                                <UserHome>
                                    <Page />
                                </UserHome>
                            }
                        />
                    ))}

                    {/* Private Routes */}
                    {privateRoutes.map(
                        ({ path, component: Page, role }, index) => (
                            <Route
                                key={index}
                                path={path}
                                element={
                                    <PrivateRoute
                                        role={role}
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
