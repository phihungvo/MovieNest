import axios from 'axios';
import { message } from 'antd';
import API_ENDPOINTS from '../../../constants/endpoints';
import { getToken } from '~/constants/token';

export const collectMovie = async (userId, movieId) => {
    try {
        const response = await axios.post(
            API_ENDPOINTS.USER.COLLECT_MOVIE(userId, movieId),
        );

        if (response.status === 200) {
            message.success(response.data);
        } else {
            message.error(response.message);
        }
    } catch (error) {
        message.error(error.message);
    }
};

export const findCollectedMoviesByUserId = async (userId) => {
    try {
        const response = await axios.get(
            API_ENDPOINTS.USER.GET_COLLECTION_MOVIE(userId),
        );

        if (response.status === 200) {
            console.log('response: >>> ', response.data)
        } else {
            console.log('error fetching collection!')
        }
    } catch (error) {
        message.error(error.message);
    }
};
