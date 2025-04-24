import axios from 'axios';
import { message } from 'antd';
import API_ENDPOINTS from '../../../constants/endpoints';
import { getToken } from '~/constants/token';

export const findMovieById = async (movieId) => {
    try {
        const response = await axios.get(
            API_ENDPOINTS.MOVIES.GET_BY_ID(movieId),
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        // console.log('Movie detail: ', response.data)
        return response.data;
    } catch (error) {
        console.error('Error find all movie: ', error);
    }
};