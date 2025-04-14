import axios from 'axios';
import { message } from 'antd';
import API_ENDPOINTS from '~/constants/endpoints';
import { getToken } from '~/constants/token';

const API_URL = process.env.REACT_APP_API_URL;

export const getAllTrailers = async ({ page = 0, pageSize = 5 }) => {
    const TOKEN = getToken();

    try {
        const response = await axios.get(API_ENDPOINTS.TRAILER.GET_ALL, {
            params: { page, pageSize },
            // withCredentials: true,
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        message.error('Error fetching trailers: ', error);
    }
};

// http://localhost:8080/api/trailers/getAllNoPaging
export const getAllTrailerNoPaging = async () => {
    const TOKEN = getToken();

    try {
        const response = await axios.get(
            API_ENDPOINTS.TRAILER.GET_ALL_NO_PAGING,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );
        return response.data;
    } catch (error) {
        message.error('Error fetching trailers: ', error);
    }
};

// http://localhost:8080/api/trailers/create
export const createTrailers = async (formData) => {
    const TOKEN = getToken();

    try {
        const response = await axios.post(
            API_ENDPOINTS.TRAILER.CREATE,
            {
                title: formData.title,
                key: formData.key,
                site: formData.site,
                trailerType: formData.trailerType,
                official: formData.official,
                movieId: formData.movie,
                publishedAt: formData.publishedAt,
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error creating trailer:', error);
    }
};

// http://localhost:8080/api/trailers/649e6bde-c155-4590-bf62-4bc04de7be44
export const handleUpdateTrailer = async (trailerId, formData) => {
    const TOKEN = getToken();

    try {
        const response = await axios.put(
            API_ENDPOINTS.TRAILER.UPDATE(trailerId),
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
        message.error('Error updating trailer: ', error);
    }
};

// http://localhost:8080/api/trailers/9c95a08b-76a2-404a-bd60-9176d6f7cea8
export const deleteTrailer = async (trailerId) => {
    const TOKEN = getToken();

    try {
        const response = await axios.delete(
            // `${API_URL}/trailers/${trailerId}`,
            API_ENDPOINTS.TRAILER.DELETE(trailerId),
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        message.success('Movie deleted successfully!');
    } catch (error) {
        message.error('Error deleting trailer: ', error);
    }
};
