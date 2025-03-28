import Home from "../pages/AdminDashboard/Home";
import Movie from "../pages/AdminDashboard/Movie";

const publicRoutes = [
    { path: '/', component: Home, title: 'Home' },
   
];

// const resultsRoutes = [
//     { path: '/search', component: SearchResult, title: 'Search Result' },
// ];

const privateRoutes = [
    { path: '/admin/movie', component: Movie, title: 'Movie' },
];

export { publicRoutes, privateRoutes };
