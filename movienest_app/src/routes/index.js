import HomeDashboard from '~/pages/AdminDashboard/HomeDashboard';
import Trailer from '~/pages/AdminDashboard/Trailer';
import UserHome from '~/pages/PublicDashboard/UserHome';
import Movie from '../pages/AdminDashboard/Movie';
import Comment from '~/pages/AdminDashboard/Comment';
import Login from '../pages/General/Login';
import Register from '../pages/General/Register';
import Actor from '../pages/AdminDashboard/Actor';
import User from '~/pages/AdminDashboard/User';

const publicRoutes = [
    { path: '/', component: UserHome, title: 'User Home' },
    { path: '/login', component: Login, title: 'Login' },
    { path: '/register', component: Register, title: 'Register' },
];

const privateRoutes = [
    { path: '/admin/dashboard', component: HomeDashboard, title: 'HomeDashboard', role: 'admin' },
    { path: '/admin/movie', component: Movie, title: 'Movie', role: 'admin' },
    { path: '/admin/trailer', component: Trailer, title: 'Trailer', role: 'admin' },
    { path: '/admin/comment', component: Comment, title: 'Comment', role: 'admin' },
    { path: '/admin/actor', component: Actor, title: 'Actor', role: 'admin' },
    { path: '/admin/user', component: User, title: 'User', role: 'admin' },
];

export { publicRoutes, privateRoutes };
