import axios from 'axios';
import { message } from 'antd';
import API_ENDPOINTS from '~/constants/endpoints';
import { getToken } from '~/constants/token';

export const getAllComments = async ({ page = 0, pageSize = 5 }) => {
    try {
        const response = await axios.get(
            API_ENDPOINTS.COMMENTS.GET_ALL_COMMENT,
            {
                params: { page, pageSize },
                headers: {
                    Authorization: `Bearer ${getToken()}`,
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

export const updateComment = async (commentId, formData) => {
    try {
        const response = await axios.put(
            API_ENDPOINTS.COMMENTS.UPDATE_PUT(commentId),
            formData,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            },
        );

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

export const updateCommentForUser = async (commentId, formData) => {
    try {
        const response = axios.patch(
            API_ENDPOINTS.COMMENTS.UPDATE(commentId),
            formData,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            },
        );

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

export const deleteComment = async (commentId) => {
    try {
        const response = await axios.delete(
            API_ENDPOINTS.COMMENTS.DELETE(commentId),
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        console.log('response: ', response.data);
    } catch (error) {
        console.error('Error deleting comment: ', error);
        throw error;
    }
};

export const reactionToAComment = async (commentId, userId, reactionType) => {
    console.log('user id: ', userId, ' : ', 'reaction type: ', reactionType);
    try {
        const response = await axios.post(
            API_ENDPOINTS.COMMENTS.REACTION_TO_A_COMMENT(commentId),
            {
                userId: userId,
                reaction: reactionType,
            },
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            },
        );
        console.log('response reaction to a comment: ', response.data);
    } catch (error) {
        console.error('Error deleting comment: ', error);
        throw error;
    }
};

export const replyToComment = async (parentId, commentData) => {
    try {
        const response = await axios.post(
            `${API_ENDPOINTS.COMMENTS.BASE_URL}/${parentId}/reply`,
            {
                content: commentData.content,
                movieId: commentData.movieId,
                userId: commentData.movieId,
            },
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        return response.data;
    } catch (error) {
        message.error('Không thể reply comment!');
    }
};
