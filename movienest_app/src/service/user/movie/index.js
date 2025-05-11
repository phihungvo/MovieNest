import axios from 'axios';
import API_ENDPOINTS from '../../../constants/endpoints';
import { getToken } from '~/constants/token';

export const findMovieById = async (movieId) => {
    try {
        const response = await axios.get(
            API_ENDPOINTS.MOVIES.GET_BY_ID(movieId));
        return response.data;
    } catch (error) {
        console.error('Error find all movie: ', error);
    }
};

export const movieDetail = async (movieId) => {
    try {
        const response = await axios.get(
            API_ENDPOINTS.MOVIES.DETAIL(movieId)
        )

        console.log('Movie detail data: ', response.data);
        return response.data;
    }catch (error){
        console.log('Error when get movie detail!');
    }
}

export const checkMovieCollection = async (movieId, userId) => {
    try {
        const response = await axios.get(
            API_ENDPOINTS.MOVIES.CHECK_COLLECTION(movieId, userId)
        );
        return response.data;
    } catch (error) {
        console.error('Error checking movie collection:', error);
        return false;
    }
};