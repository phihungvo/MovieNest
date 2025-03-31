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
        console.log('Response>s>> : ', response);

        console.log('Fetching trailers>>> : ', response.data);
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

    console.log('form data: ', formData);

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
                trailerType: formData.trailerType,
                official: formData.official,
                movieId: formData.movieId,
                publishedAt: publishedAt,
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        console.log('Response: ', response.data)
        return response.data;
    } catch (error) {
        // message.error(
        //     'Error create trailer: ',
        //     error.response ? error.response.data : error.message,
        // );
        throw error;
    }
};

// {
//     "title": "Behind The Scenes",
//     "key": "bts567",
//     "site": "Vimeo",
//     "trailerType": "BEHIND_THE_SCENES",
//     "official": true,
//     "movieId": "762b84c9-4c91-485a-a086-a2d8b2a19397",
//     "publishedAt": "2024-04-02T14:30:00Z"
// }
