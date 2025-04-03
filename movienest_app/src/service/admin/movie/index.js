import axios from 'axios';
import { message } from 'antd';

const API_URL = process.env.REACT_APP_API_URL;

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
    const TOKEN = localStorage.getItem('token');

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

        console.log('Movie arr : ', moviearr)

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
    const TOKEN = localStorage.getItem('token');

    console.log('form data: ', formData);

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
                vote_average: formData.vote_average || 0,
                vote_count: formData.vote_count || 0,
                popular: formData.popular,
                inTheater: formData.inTheater,
                genres: formData.genres,
                trailers: formData.trailers || [],
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

// http://localhost:8080/api/movie/update?movieId=7ae4a794-e5a7-419d-a6ba-8ec0c88dfe13
export const handleUpdateMovie = async (movieId, formData) => {
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
        return response.data; // Return the data for success case
    } catch (error) {
        // Lấy message từ lỗi
        const errorMessage =
            error.response?.data?.message || 'Something went wrong';

        // Hiển thị message
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
        return response.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || 'Something went wrong';

        message.error(`${errorMessage}`);
        console.error('Error deleting movie:', errorMessage);
        throw error;
    }
};
