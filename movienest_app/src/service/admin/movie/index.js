import axios from 'axios';
import { message } from 'antd';
import API_ENDPOINTS from '../../../constants/endpoints';
import { getToken } from '~/constants/token';
import { uploadFile } from '../uploadFile';

const API_URL = process.env.REACT_APP_API_URL;

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

export const getAllMovies = async ({ page = 0, pageSize = 5, keyWord = '' }) => {
    const TOKEN = getToken();

    try {
        const response = await axios.get(API_ENDPOINTS.MOVIES.GET_ALL, {
            params: { page, pageSize, keyWord },
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
        const releaseDate = formData.releaseDate?.format
            ? formData.releaseDate.format('YYYY-MM-DD')
            : formData.releaseDate;

        const posterPath = await processImageUpload(formData.posterPath);
        const backdropPath = await processImageUpload(formData.backdropPath);

        const movieData = {
            title: formData.title,
            overview: formData.overview,
            releaseDate,
            posterPath,
            backdropPath,
            country: formData.country,
            voteAverage: formData.voteAverage || 0,
            voteCount: formData.voteCount || 0,
            popularity: formData.popularity || 0,
            popular: formData.popular === 'Yes',
            adult: formData.adult === 'Yes',
            inTheater: formData.inTheater === 'Yes',
            genres: formData.genres,
            trailers: formData.trailers || [],
            comments: formData.comments || [],
        };

        const response = await axios.post(
            API_ENDPOINTS.MOVIES.CREATE,
            movieData,
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
        message.error(
            'Error creating movie: ' + (error.message || 'Unknown error'),
        );
        throw error;
    }
};

export const processImageUpload = async (imageData) => {
    if (!imageData || typeof imageData !== 'object') return null;

    const file = Array.isArray(imageData) ? imageData[0] : imageData;
    if (!file) return null;

    console.log('File data:', file);

    if (typeof file.url === 'string') return file.url;

    if (file.originFileObj) {
        try {
            const { url, alreadyExists } = await uploadFile(file.originFileObj);
            console.log(
                `Image ${
                    alreadyExists ? 'already exists' : 'uploaded'
                }: ${url}`,
            );
            return url;
        } catch (err) {
            const isAlreadyExists =
                err?.response?.data?.message?.includes('already exists');
            if (isAlreadyExists) {
                console.warn('Using existing file URL');
                return `${API_URL}/storage/files/${file.originFileObj.name}`;
            }
            throw err;
        }
    }

    return null;
};

export const handleUpdateMovie = async (movieId, formData) => {
    const TOKEN = getToken();

    try {
        let releaseDate = null;
        if (formData.releaseDate) {
            releaseDate = formData.releaseDate.format
                ? formData.releaseDate.format('YYYY-MM-DD')
                : formData.releaseDate;
        }

        const posterPath = await processImageUpload(formData.posterPath);
        const backdropPath = await processImageUpload(formData.backdropPath);

        const updatedFormData = {
            ...formData,
            posterPath,
            backdropPath,
            releaseDate,
        };
        console.log('Updating movie with data>>>>>>>>>>>>>:', updatedFormData);

        const response = await axios.put(
            API_ENDPOINTS.MOVIES.UPDATE(movieId),
            updatedFormData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response.data) {
            message.success('Movie updated successfully!');
        }
        return response.data;
    } catch (error) {
        message.error(
            'Error updating movie: ' + (error.message || 'Unknown error'),
        );
        throw error;
    }
};

export const findAllKoreanMovies = async () => {
    const TOKEN = getToken();

    try {
        const response = await axios.get(API_ENDPOINTS.MOVIES.KOREAN_MOVIES, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        // console.log('Korean movies: ', response)

        return response.data;
    } catch (error) {
        console.error('Error find all movie: ', error);
    }
};

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
