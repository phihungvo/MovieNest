import axios from 'axios';
import { message } from 'antd';
import API_ENDPOINTS from '../../../constants/endpoints';
import { getToken } from '~/constants/token';

const API_URL = process.env.REACT_APP_API_URL;

// Sửa lỗi trong hàm searchMovieByKeyWord
export const searchMovieByKeyWord = async (keyWord) => {
    const TOKEN = localStorage.getItem('token');

    try {
        console.log('Start searching with keyword:', keyWord);
        const response = await axios.post(
            API_ENDPOINTS.MOVIES.SEARCH(keyWord),
            {},
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error searching movie: ', error);
    }
};

export const getAllMovies = async ({ page = 0, pageSize = 5 }) => {
    const TOKEN = getToken();

    try {
        const response = await axios.get(API_ENDPOINTS.MOVIES.GET_ALL, {
            params: { page, pageSize },
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching movies: ', error);
    }
};

// http://localhost:8080/api/movie/findAllNoPaging
export const findAllMovieNoPaging = async () => {
    const TOKEN = getToken();

    try {
        const response = await axios.get(
            API_ENDPOINTS.MOVIES.GET_ALL_NO_PAGING,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        const movies = response.data;
        const moviearr = movies.map((movie, index) => ({
            id: movie.id,
            name: movie.title,
        }));

        return moviearr;
    } catch (error) {
        console.error('Error find all movie: ', error);
    }
};

export const createMovie = async (formData) => {
    const TOKEN = getToken();

    try {
        let releaseDate = null;
        if (formData.releaseDate) {
            releaseDate = formData.releaseDate.format
                ? formData.releaseDate.format('YYYY-MM-DD')
                : formData.releaseDate;
        }

        const response = await axios.post(
            API_ENDPOINTS.MOVIES.CREATE,
            {
                title: formData.title,
                overview: formData.overview,
                releaseDate: releaseDate,
                posterPath: formData.posterPath,
                backdropPath: formData.backdropPath,
                voteAverage: formData.voteAverage || 0,
                voteCount: formData.voteCount || 0,
                popularity: formData.popularity || 0,
                popular: formData.popular,
                adult: formData.adult,
                inTheater: formData.inTheater,
                genres: formData.genres,
                trailers: formData.trailers || [],
                comments: formData.comments || [],
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response.data) {
            message.success('Movie created successfully!');
        }
        return response.data;
    } catch (error) {
        message.error('Error creating movie: ', error);
    }
};

// http://localhost:8080/api/movie/update/0bde48a3-1dbc-4174-95ec-d9753cd5ec3d
export const handleUpdateMovie = async (movieId, formData) => {
    const TOKEN = getToken();

    try {
        let releaseDate = null;
        if (formData.releaseDate) {
            releaseDate = formData.releaseDate.format
                ? formData.releaseDate.format('YYYY-MM-DD')
                : formData.releaseDate;
        }

        const response = await axios.put(
            API_ENDPOINTS.MOVIES.UPDATE(movieId),
            formData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        return response.data;
    } catch (error) {
        message.error('Error updating movie:', error);
    }
};

// http://localhost:8080/api/movie/delete?movieId=17a1c81c-be64-4229-ac64-c4ffa4ffb5e9
export const deleteMovie = async (movieId) => {
    const TOKEN = getToken();

    try {
        const response = await axios.delete(
            API_ENDPOINTS.MOVIES.DELETE(movieId),
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );
    } catch (error) {
        message.error('Error deleting movie:', error);
    }
};
