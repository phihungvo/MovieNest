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

        return response.data;
    } catch (error) {
        console.error(
            'Error fetching comments:',
            error.response ? error.response.data : error.message,
        );
    }
};

export const getCommentsByMovieId = async ({
    movieId,
    page = 0,
    pageSize = 5,
}) => {
    try {
        const response = await axios.get(
            API_ENDPOINTS.COMMENTS.GET_COMMENT_BY_MOVIE_ID(movieId),
            {
                params: {
                    page: page,
                    pageSize: pageSize,
                },
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error(
            'Error fetching comments:',
            error.response ? error.response.data : error.message,
        );
    }
};

export const createComment = async (data) => {
    try {
        const response = await axios.post(API_ENDPOINTS.COMMENTS.CREATE, data, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
        });

        if (response) {
            message.success('Bình luận đã được gửi thành công!');
        }

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

        if (response) {
            message.success('Bình luận đã được cập nhật');
        }
    } catch (error) {
        console.error(
            'Error updating comment:',
            error.response ? error.response.data : error,
        );
        throw error;
    }
};

export const updateCommentForUser = async (commentId, formData) => {
    console.log('Form data: ', formData);
    try {
        const response = axios.patch(
            API_ENDPOINTS.COMMENTS.UPDATE(commentId),
            formData,
        );

        if (!response) {
            message.success('Comment updated Failed !');
        }

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
        );

        if (response) {
            message.success('Bình luận đã được xóa');
        }
    } catch (error) {
        console.error('Error deleting comment: ', error);
        throw error;
    }
};

export const reactionToAComment = async (commentId, userId, reactionType) => {
    try {
        const response = await axios.post(
            API_ENDPOINTS.COMMENTS.REACTION_TO_A_COMMENT(commentId),
            {
                userId: userId,
                reaction: reactionType['reactionType']
            }
        );
        console.log('response reaction to a comment: ', response.data);
    } catch (error) {
        console.error('Error deleting comment: ', error);
        throw error;
    }
};

export const replyToComment = async (parentId, replyData) => {
    try {
        const response = await axios.post(
            API_ENDPOINTS.COMMENTS.REPLY_TO_A_COMMENT(parentId),
            {
                content: replyData.content,
                movieId: replyData.movieId,
                userId: replyData.userId,
            },
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response) {
            message.success('Phản hồi đã được gửi thành công');
        }

        return response.data;
    } catch (error) {
        message.error('Không thể reply comment!');
    }
};
