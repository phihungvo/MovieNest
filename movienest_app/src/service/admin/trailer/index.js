import axios from 'axios';
import { message } from 'antd';

const API_URL = process.env.REACT_APP_API_URL;

export const getAllTrailers = async ({ page = 0, pageSize = 5 }) => {
    const TOKEN = localStorage.getItem('token');

    try {
        const response = await axios.get(`${API_URL}/trailers/getAll`, {
            params: {
                page: page,
                pageSize: pageSize,
            },
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        // console.log('Response>s>> : ', response);

        // console.log('Fetching trailers>>> : ', response.data);
        return response.data;
    } catch (error) {
        message.error(
            'Error fetching trailers:',
            error.response ? error.response.data : error.message,
        );
        throw error;
    }
};

// http://localhost:8080/api/trailers/create
export const createTrailers = async (formData) => {
    const TOKEN = localStorage.getItem('token');

    console.log('form data >>????___: ', formData);

    try {
        let publishedAt = null;
        if (formData.publishedAt) {
            publishedAt = formData.publishedAt.formData
                ? formData.publishedAt.format('YYYY-MM-DD')
                : formData.publishedAt;
        }

        const response = await axios.post(
            `${API_URL}/trailers/create`,
            {
                title: formData.title,
                key: formData.key,
                site: formData.site,
                trailerType: formData.type,
                official: formData.official,
                movieId: formData.movies,
                publishedAt: publishedAt,
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        console.log('Response: ', response.data);
        return response.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || 'Something went wrong';

        message.error(`${errorMessage}`);
        console.error('Error deleting trailer:', errorMessage);
    }
};

// http://localhost:8080/api/trailers/649e6bde-c155-4590-bf62-4bc04de7be44
export const handleUpdateTrailer = async (trailerId, formData) => {
    const TOKEN = localStorage.getItem('token');

    try {
        const response = await axios.put(
            `${API_URL}/trailers/${trailerId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (!response || response.error) {
            const errorMessage = response?.error || 'Movie update failed!';
            message.error(`Error: ${errorMessage}`);
            return;
        }

        console.log('response: ', response.data);
        return response.data; // Return the data for success case
    } catch (error) {
        throw error;
    }
};

// http://localhost:8080/api/trailers/9c95a08b-76a2-404a-bd60-9176d6f7cea8
export const deleteTrailer = async (trailerId) => {
    const TOKEN = localStorage.getItem('token');

    console.log('Delete trailer by id: ', trailerId);

    try {
        const response = await axios.delete(
            `${API_URL}/trailers/${trailerId}`,
            {
                // params: {
                //     trailerId: trailerId,
                // },
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (!response || response.error) {
            const errorMessage = response?.error || 'Movie delete failed!';
            message.error(`Error: ${errorMessage}`);
            return;
        }
        message.success('Movie deleted successfully!');
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || 'Something went wrong';

        message.error(`${errorMessage}`);
        console.error('Error deleting trailer:', errorMessage);
    }
};
