import Trailer from '~/pages/AdminDashboard/Trailer';
import UserHome from '~/pages/PublicDashboard/UserHome';
import Movie from '../pages/AdminDashboard/Movie';
import Login from '../pages/General/Login';
import Register from '../pages/General/Register';

const publicRoutes = [
    { path: '/', component: UserHome, title: 'User Home' },
    { path: '/login', component: Login, title: 'Login' },
    { path: '/register', component: Register, title: 'Register' },
];

const privateRoutes = [
    { path: '/admin/movie', component: Movie, title: 'Movie', role: 'admin' },
    { path: '/admin/trailer', component: Trailer, title: 'Trailer', role: 'admin' },
];

export { publicRoutes, privateRoutes };
