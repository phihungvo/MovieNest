import axios from 'axios';
import { message } from 'antd';

// const API_URL = process.env.REACT_APP_API_URL;
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Sửa lỗi trong hàm searchMovieByKeyWord
export const searchMovieByKeyWord = async (keyWord) => {
    const TOKEN = localStorage.getItem('token');

    try {
        console.log('Start searching with keyword:', keyWord);
        const response = await axios.post(
            `${API_URL}/movie/search?keyWord=${encodeURIComponent(keyWord)}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        console.log('Search movie results:', response.data);
        return response.data;
    } catch (error) {
        console.error(
            'Error searching movie:',
            error.response ? error.response.data : error,
        );
        throw error;
    }
};

export const getAllMovies = async ({ page = 0, pageSize = 5 }) => {
    console.log('API URL--------:', process.env.REACT_APP_API_URL);
    console.log('Token:', process.env.REACT_APP_TOKEN);

    const TOKEN = localStorage.getItem('token');
    console.log('Token get all movie: ', TOKEN);

    try {
        const response = await axios.get(`${API_URL}/movie/getAll`, {
            params: {
                page: page,
                pageSize: pageSize,
            },
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('data: ', response.data)
        return response.data;
    } catch (error) {
        console.error(
            'Error fetching movies:',
            error.response ? error.response.data : error.message,
        );
        throw error;
    }
};

// http://localhost:8080/api/movie/findAllNoPaging
export const findAllMovieNoPaging = async () => {
    const TOKEN = localStorage.getItem('token');

    try {
        const response = await axios.get(`${API_URL}/movie/findAllNoPaging`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        const movies = response.data;
        const moviearr = movies.map((movie, index) => (
            {
                id: movie.id,
                name: movie.title,
            }
        ))

        // console.log('Movie arr : ', moviearr)

        return moviearr;
    } catch (error) {
        console.error(
            'Error find all movie:',
            error.response ? error.response.data : error,
        );
        throw error;
    }
};

export const createMovie = async (formData) => {
    console.log(`API URL :)))))) ${API_URL}/movie/update/`);
    console.log('Token:', process.env.REACT_APP_TOKEN);
    
    const TOKEN = localStorage.getItem('token');
    
    try {
        let releaseDate = null;
        if (formData.releaseDate) {
            releaseDate = formData.releaseDate.format
                ? formData.releaseDate.format('YYYY-MM-DD')
                : formData.releaseDate;
        }

        console.log('Release date: ', releaseDate);

        const response = await axios.post(
            `${API_URL}/movie/create`,
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

        console.log('Movie Created:', response.data);
        return response.data;
    } catch (error) {
        console.error(
            'Error creating movie:',
            error.response ? error.response.data : error,
        );
        throw error;
    }
};

// http://localhost:8080/api/movie/update/0bde48a3-1dbc-4174-95ec-d9753cd5ec3d
export const handleUpdateMovie = async (movieId, formData) => {
    console.log(`Api url+++++: ${API_URL}/movie/update/${movieId}`);
    const TOKEN = localStorage.getItem('token');

    console.log('id: ', movieId, ' formdata: ', formData);

    try {
        let releaseDate = null;
        if (formData.releaseDate) {
            releaseDate = formData.releaseDate.format
                ? formData.releaseDate.format('YYYY-MM-DD')
                : formData.releaseDate;
        }

        console.log('PUT Method');
        const response = await axios.put(
            `${API_URL}/movie/update/${movieId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        console.log('response: ', response.data);
        return response.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || 'Something went wrong';

        message.error(`${errorMessage}`);
        console.error('Error updating movie:', errorMessage);
        throw error;
    }
};

// http://localhost:8080/api/movie/delete?movieId=17a1c81c-be64-4229-ac64-c4ffa4ffb5e9
export const deleteMovie = async (movieId) => {
    const TOKEN = localStorage.getItem('token');

    console.log('Delete movie id: ', movieId);

    try {
        const response = await axios.delete(`${API_URL}/movie/delete`, {
            params: {
                movieId: movieId,
            },
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('response: ', response.data);
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || 'Something went wrong';

        message.error(`${errorMessage}`);
        console.error('Error deleting movie:', errorMessage);
        throw error;
    }
};
