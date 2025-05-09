import axios from 'axios';
import { message } from 'antd';
import API_ENDPOINTS from '../../../constants/endpoints';
import { getToken } from '~/constants/token';
import { uploadFile } from '../uploadFile';

const API_URL = process.env.REACT_APP_API_URL;

export const searchMovieByKeyWord = async (keyWord) => {
    try {
        const response = await axios.post(
            API_ENDPOINTS.MOVIES.SEARCH(keyWord),
            {},
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        console.log('Search data: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error searching movie: ', error);
    }
};

export const getAllMovies = async ({
    page = 0,
    pageSize = 5,
    keyWord = '',
}) => {
    try {
        const response = await axios.get(API_ENDPOINTS.MOVIES.GET_ALL, {
            params: { page, pageSize, keyWord },
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching movies: ', error);
    }
};

export const findAllMovieNoPaging = async () => {
    try {
        const response = await axios.get(
            API_ENDPOINTS.MOVIES.GET_ALL_NO_PAGING,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
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
    try {
        const releaseDate = formData.releaseDate?.format
            ? formData.releaseDate.format('YYYY-MM-DD')
            : formData.releaseDate;

        const posterPath = await processImageUpload(formData.posterPath);
        const backdropPath = await processImageUpload(formData.backdropPath);

        const movieData = {
            ...formData,
            releaseDate,
            posterPath,
            backdropPath,
        };

        const response = await axios.post(
            API_ENDPOINTS.MOVIES.CREATE,
            movieData,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
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
    try {
        let releaseDate = null;
        if (formData.releaseDate) {
            releaseDate = formData.releaseDate.format
                ? formData.releaseDate.format('YYYY-MM-DD')
                : formData.releaseDate;
        }

        const posterPath = await processImageUpload(formData.posterPath);
        const backdropPath = await processImageUpload(formData.backdropPath);
        
        console.log('form data: ', formData);

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
                    Authorization: `Bearer ${getToken()}`,
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

// export const findAllVietnamMovies = async () => {
//     try {
//         const response = await axios.get(API_ENDPOINTS.MOVIES.VIETNAME_MOVIES, {
//             headers: {
//                 Authorization: `Bearer ${getToken()}`,
//                 'Content-Type': 'application/json',
//             },
//         });

//         console.log('Vietname movie: ', response.data)
//         return response.data;
//     } catch (error) {
//         console.error('Error find all movie: ', error);
//     }
// };

export const findAllKoreanMovies = async () => {
    try {
        const response = await axios.get(API_ENDPOINTS.MOVIES.KOREAN_MOVIES);

        return response.data;
    } catch (error) {
        console.error('Error find all movie: ', error);
    }
};

export const deleteMovie = async (movieId) => {
    try {
        const response = await axios.delete(
            API_ENDPOINTS.MOVIES.DELETE(movieId),
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            },
        );
        if (response.data) {
            message.success('Movie delete successfully!');
        }
    } catch (error) {
        message.error('Error deleting movie:', error);
    }
};
