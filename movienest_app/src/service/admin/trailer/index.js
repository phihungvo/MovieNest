import axios from 'axios';
import { message } from 'antd';
import API_ENDPOINTS from '~/constants/endpoints';
import { getToken } from '~/constants/token';

const API_URL = process.env.REACT_APP_API_URL;

export const getAllTrailers = async ({ page = 0, pageSize = 5 , keyWord = '' }) => {
    try {
        const response = await axios.get(API_ENDPOINTS.TRAILER.GET_ALL, {
            params: { page, pageSize, keyWord },
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Reponse search: ', response.data);
        return response.data;
    } catch (error) {
        message.error('Error fetching trailers: ', error);
    }
};

export const getAllTrailerNoPaging = async () => {
    try {
        const response = await axios.get(
            API_ENDPOINTS.TRAILER.GET_ALL_NO_PAGING,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            },
        );
        return response.data;
    } catch (error) {
        message.error('Error fetching trailers: ', error);
    }
};

export const getTrailersWithoutMovie = async () => {
    try {
        const response = await axios.get(
            API_ENDPOINTS.TRAILER.WITHOUT_MOVIE,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            }
        )

        console.log('without movie: ', response.data);
        return response.data;
    }catch (error){
        console.error('Error when fetching all trailer without movie! ', error)
    }
}

export const getTrailerById = async (trailerId) => {
    try {
        const response = await axios.get(
            API_ENDPOINTS.TRAILER.GET_BY_ID(trailerId),
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            },
        );
        return response.data;
    } catch (error) {
        console.log('Error when fetching trailer by id: ', error);
    }
};

export const getTrailerByMovieId = async (movieId) => {
    try {
        const response = await axios.get(
            API_ENDPOINTS.TRAILER.GET_TRAILER_BY_MOVIE_ID(movieId)
        );
        return response.data;
    } catch (error) {
        console.log('Error when fetching trailer by movieId: ', error);
    }
};

export const createTrailers = async (formData) => {

    console.log('Form data trailer: ', formData);

    try {
        const response = await axios.post(
            API_ENDPOINTS.TRAILER.CREATE,
            {
                title: formData.title,
                key: formData.key,
                site: formData.site,
                trailerType: formData.trailerType,
                official: formData.official,
                movieIds: formData.movie,
                publishedAt: formData.publishedAt
            },
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        message.success('Create trailer success: ');
        console.log('creating trailer:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating trailer:', error);
    }
};

export const handleUpdateTrailer = async (trailerId, formData) => {
    try {
        const response = await axios.put(
            API_ENDPOINTS.TRAILER.UPDATE(trailerId),
            formData,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            },
        );
        return response.data;
    } catch (error) {
        message.error('Error updating trailer: ', error);
    }
};

export const deleteTrailer = async (trailerId) => {
    try {
        const response = await axios.delete(
            API_ENDPOINTS.TRAILER.DELETE(trailerId),
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        message.success('Movie deleted successfully!');
    } catch (error) {
        message.error('Error deleting trailer: ', error);
    }
};
