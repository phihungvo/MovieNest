import Home from '../pages/AdminDashboard/Home';
import Movie from '../pages/AdminDashboard/Movie';
import Login from '../pages/General/Login';
import Register from '../pages/General/Register';

const publicRoutes = [
    { path: '/', component: Home, title: 'Home' },
    { path: '/login', component: Login, title: 'Login' },
    { path: '/register', component: Register, title: 'Register' },
];

// const resultsRoutes = [
//     { path: '/search', component: SearchResult, title: 'Search Result' },
// ];

const privateRoutes = [
    { path: '/admin/movie', component: Movie, title: 'Movie' },
];

export { publicRoutes, privateRoutes };
