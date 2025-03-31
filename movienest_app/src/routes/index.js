import Trailer from '~/pages/AdminDashboard/Trailer';
import Home from '../pages/AdminDashboard/Home';
import Movie from '../pages/AdminDashboard/Movie';
import Login from '../pages/General/Login';
import Register from '../pages/General/Register';

const publicRoutes = [
    { path: '/', component: Home, title: 'Home' },
    // { path: '/admin/login', component: Login, title: 'Login' },
    // { path: '/admin/register', component: Register, title: 'Register' },
];

// const resultsRoutes = [
//     { path: '/search', component: SearchResult, title: 'Search Result' },
// ];

const privateRoutes = [
    { path: '/admin/movie', component: Movie, title: 'Movie' },
    { path: '/admin/trailer', component: Trailer, title: 'Trailer' },
    { path: '/admin/login', component: Login, title: 'Login' },
    { path: '/admin/register', component: Register, title: 'Register' },
];

export { publicRoutes, privateRoutes };
