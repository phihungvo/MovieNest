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

// http://localhost:8080/api/comment/1627bcde-4570-4e50-a943-c2137fff41d0 update PUT
export const updateComment = async (commentId, formData) => {
    const TOKEN = getToken();
    const url = API_ENDPOINTS.COMMENTS.UPDATE_PUT(commentId);
    console.log('form data update comment: ', formData);
    try {
        const response = await axios.put(url, formData, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response) {
            message.success('Comment updated Failed !');
        }

        console.log('data: >>>> ', response.data);
    } catch (error) {
        console.error(
            'Error updating comment:',
            error.response ? error.response.data : error,
        );
        throw error;
    }
};

// http://localhost:8080/api/comment/1627bcde-4570-4e50-a943-c2137fff41d0 update PATCH
export const updateCommentForUser = async (commentId, formData) => {
    const TOKEN = getToken();
    const url = API_ENDPOINTS.COMMENTS.UPDATE(commentId);

    try {
        const response = axios.patch(url, formData, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response) {
            message.success('Comment updated Failed !');
        }

        console.log('data: >>>> ', response.data);
    } catch (error) {
        console.error(
            'Error updating comment:',
            error.response ? error.response.data : error,
        );
        throw error;
    }
};

// http://localhost:8080/api/comment/249f2e10-b3c0-4d65-b873-f3748d65064d delete DELETE
export const deleteComment = async (commentId) => {
    const TOKEN = getToken();
    const url = API_ENDPOINTS.COMMENTS.DELETE(commentId);
    try {
        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('response: ', response.data);
    } catch (error) {
        console.error('Error deleting comment: ', error);
        throw error;
    }
};
