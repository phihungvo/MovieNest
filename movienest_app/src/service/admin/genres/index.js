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

export const getGenresByMovieId = async (movieId) => {
    console.log('movieid: ', movieId)
    try {
        const response = await axios.get(
            API_ENDPOINTS.GENRES.GET_BY_MOVIE_ID(movieId)
        );

        console.log('get genres by movie id: ', response.data);

    }catch(error){
        console.log('Error get genres by movie id ', error);
    }
}