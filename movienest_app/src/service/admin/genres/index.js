import axios from 'axios';
import { getToken } from '~/constants/token';
import API_ENDPOINTS from '~/constants/endpoints';

const API_URL = process.env.REACT_APP_API_URL;

export const getAllGenres = async () => {
    const TOKEN = getToken();
    try {
        const response = await axios.get(
            API_ENDPOINTS.GENRES.GET_ALL
            ,{
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
};
