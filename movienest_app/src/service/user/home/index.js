import axios from 'axios';
import API_ENDPOINTS from '~/constants/endpoints';
import { getToken } from '~/constants/token';
import { getTrailerByMovieId } from '~/service/admin/trailer';

const API_KEY =
    process.env.REACT_APP_TMDB_API_KEY || 'aad34a977eb04581217d21401cd37a60';
const BASE_URL =
    process.env.REACT_APP_BASE_URL || 'https://api.themoviedb.org/3';

if (!BASE_URL) {
    console.error('⚠️ BASE_URL is undefined! Check your .env file.');
}

// Create axios instance with baseURL
const tmdbApi = axios.create({
    baseURL: BASE_URL,
});

// https://api.themoviedb.org/3/search/multi?query=b&page=500&api_key=aad34a977eb04581217d21401cd37a60
export const searchMovies = async (query) => {
    try {
        const response = await axios.get(`${BASE_URL}/search/multi`, {
            params: {
                api_key: API_KEY,
                page: 1,
                query: query,
            },
        });
        console.error(
            'Fetching successfully search multi type... ',
            response.data.results,
        );
        return response.data.results;
    } catch (error) {
        console.error('Error fetching search multi type... ', error);
        return [];
    }
};

export const getMovieToday = async () => {
    const TOKEN = getToken();
    try {
        const response = await axios.get(API_ENDPOINTS.MOVIES.TODAY, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching movies today: ', error);
        return [];
    }
};

export const getMovieInWeek = async () => {
    const TOKEN = getToken();
    try {
        const response = await axios.get(API_ENDPOINTS.MOVIES.THIS_WEEK, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching movies in this week: ', error);
        return [];
    }
};

export const getPopularMovie = async () => {
    const TOKEN = getToken();
    try {
        const response = await axios.get(API_ENDPOINTS.MOVIES.POPULAR, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching popular movies: ', error);
        return [];
    }
};

const getMoviesWithTrailers = async (endpoint) => {
    try {
        const moviesResponse = await axios.get(endpoint, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
        });

        const movies = moviesResponse.data;
        // console.log(`Movies from ${endpoint}: `, movies);

        const moviesWithTrailers = await Promise.all(
            movies.slice(0, 20).map(async (movie) => {
                try {
                    const trailerResponse = await getTrailerByMovieId(movie.id);

                    return {
                        ...movie,
                        trailer_key:
                            trailerResponse.length > 0
                                ? trailerResponse[0].key
                                : null,
                    };
                } catch (error) {
                    console.error(
                        `Error fetching videos for movie ${movie.id}:`,
                        error,
                    );
                    return {
                        ...movie,
                        trailer_key: null,
                        image_path: null,
                    };
                }
            }),
        );
        // Lọc ra những phim có trailer
        return moviesWithTrailers.filter((movie) => movie.trailer_key !== null);
    } catch (error) {
        console.error(`Error fetching movies from ${endpoint}:`, error);
        return [];
    }
};


export const getVietnameMovieTrailers = async () => {
    return getMoviesWithTrailers(API_ENDPOINTS.MOVIES.VIETNAME_MOVIES);
}

export const getPopularMovieTrailers = async () => {
    return getMoviesWithTrailers(API_ENDPOINTS.MOVIES.POPULAR);
}

export const getInThreatersMovieTrailers = async () => {
    return getMoviesWithTrailers(API_ENDPOINTS.MOVIES.IN_THEATER);
};

export const getDetailtMovie = async (movieId) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
            params: {
                api_key: API_KEY,
            },
        });

        // console.log('Reponse detail movie: ', response.data.results);
    } catch (error) {
        console.log('Get Detail Movie with error: ', error);
        return [];
    }
};
