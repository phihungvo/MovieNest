import HomeDashboard from '~/pages/AdminDashboard/HomeDashboard';
import Trailer from '~/pages/AdminDashboard/Trailer';
import UserHome from '~/pages/PublicDashboard/UserHome';
import Movie from '../pages/AdminDashboard/Movie';
import Comment from '~/pages/AdminDashboard/Comment';
import Login from '../pages/General/Login';
import Register from '../pages/General/Register';
import Actor from '../pages/AdminDashboard/Actor';
import User from '~/pages/AdminDashboard/User';
import MovieDetail from '~/pages/PublicDashboard/MovieDetail';
import Banner from '~/pages/AdminDashboard/Banner';
import UserInfoManagement from '~/pages/PublicDashboard/UserInfoManagement';

const publicRoutes = [
    { path: '/', component: UserHome, title: 'User Home' },
    { path: '/login', component: Login, title: 'Login' },
    { path: '/register', component: Register, title: 'Register' },
    { path: '/movie/:movieId', component: MovieDetail, title: 'Movie Detail' },
    {
        path: '/user-info-management',
        component: UserInfoManagement,
        title: 'User Info',
    },
    {
        path: '/user-info-management/personal',
        component: UserInfoManagement,
    },
    {
        path: '/user-info-management/history',
        component: UserInfoManagement,
    },
    {
        path: '/user-info-management/collection',
        component: UserInfoManagement,
    },
    {
        path: '/user-info-management/security',
        component: UserInfoManagement,
    },
    {
        path: '/user-info-management/notifications',
        component: UserInfoManagement,
    },
];

const privateRoutes = [
    {
        path: '/admin/dashboard',
        component: HomeDashboard,
        title: 'HomeDashboard',
        role: 'admin',
    },
    {
        path: '/admin/movie',
        component: Movie,
        title: 'Movie Management',
        role: 'admin',
    },
    {
        path: '/admin/trailer',
        component: Trailer,
        title: 'Trailer Management',
        role: 'admin',
    },
    {
        path: '/admin/comment',
        component: Comment,
        title: 'Comment Management',
        role: 'admin',
    },
    {
        path: '/admin/actor',
        component: Actor,
        title: 'Actor Management',
        role: 'admin',
    },
    {
        path: '/admin/user',
        component: User,
        title: 'User Management',
        role: 'admin',
    },
    {
        path: '/admin/banner',
        component: Banner,
        title: 'Banner Management',
        role: 'admin',
    },
];

export { publicRoutes, privateRoutes };
