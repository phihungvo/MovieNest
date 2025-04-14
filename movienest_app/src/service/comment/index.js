import axios from 'axios';
import { message } from 'antd';
import API_ENDPOINTS from '~/constants/endpoints';
import { getToken } from '~/constants/token';

// http://localhost:8080/api/comment/getAll?page=0
export const getAllComments = async ({ page = 0, pageSize = 5 }) => {
    const TOKEN = getToken();

    try {
        const response = await axios.get(
            API_ENDPOINTS.COMMENTS.GET_ALL_COMMENT,
            {
                params: { page, pageSize },
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        console.log('comment data: ', response.data);
        return response.data;
    } catch (error) {
        console.error(
            'Error fetching comments:',
            error.response ? error.response.data : error.message,
        );
    }
};

// http://localhost:8080/api/comment/create
export const createComment = async (data) => {
    const TOKEN = getToken();

    try {
        const response = await axios.post(
            API_ENDPOINTS.COMMENTS.CREATE,
            {
                content: data.content,
                movieId: data.movieId,
                userId: data.userId,
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (!response) {
            message.success('Comment Create Failed !');
        }

        console.log('data: >>>> ', response.data);
        return response.data;
    } catch (error) {
        console.error(
            'Error creating comment:',
            error.response ? error.response.data : error,
        );
        throw error;
    }
};

// http://localhost:8080/api/comment/1627bcde-4570-4e50-a943-c2137fff41d0
