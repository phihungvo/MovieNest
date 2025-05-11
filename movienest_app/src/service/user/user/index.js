import axios from 'axios';
import { message } from 'antd';
import API_ENDPOINTS from '../../../constants/endpoints';
import { getToken } from '~/constants/token';

export const createCollection = async (userId, movieId) => {
    console.log('user_id: ', userId, ' movie_id: ', movieId)
    try {
        const response = await axios.post(
            API_ENDPOINTS.COLLECTIONS.COLLECT(userId, movieId),
        );

        // if (response.status === 200) {
        //      message.success(response.data);
        // } else if (response.status === 409) {
        //     message.error(response.message);
        // }
    } catch (error) {
        message.error(error.message);
    }
};


export const unCollect = async (userId, movieId) => {
    console.log('user_id: ', userId, ' movie_id: ', movieId)
    try {
        const response = await axios.delete(
            API_ENDPOINTS.COLLECTIONS.UN_COLLECT(userId, movieId),
        );

        // if (response.status === 200) {
        //      message.success(response.data);
        // } else if (response.status === 409) {
        //     message.error(response.message);
        // }
    } catch (error) {
        message.error(error.message);
    }
};



export const findCollectedMoviesByUserId = async (userId) => {
    try {
        const response = await axios.get(
            API_ENDPOINTS.COLLECTIONS.GET_COLLECTION(userId),
        );

        if (response.status === 200) {
            console.log('response: >>> ', response)
            return response.data;
        } else {
            console.log('error fetching collection!')
        }
    } catch (error) {
        message.error(error.message);
    }
};
