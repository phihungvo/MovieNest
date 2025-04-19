import axios from 'axios';
import API_ENDPOINTS from '../../../constants/endpoints';
import { getToken } from '~/constants/token';
import { message } from 'antd';

export const login = async (email, password) => {
    try {
        const response = await axios.post(
            API_ENDPOINTS.AUTH.LOGIN,
            { email, password },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response.status === 200) return response.data.token;
    } catch (error) {
        console.log('Login error: ', error);
        console.error('Error in login !');
    }
};

export const register = async (username, email, password) => {
    try {
        const response = await axios.post(
            API_ENDPOINTS.AUTH.REGISTER,
            { username, email, password },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response.status === 200) return response.data.token;
    } catch (error) {
        console.log('Register error: ', error);
        message.error('Register failed !');
    }
};

export const getAllUser = async ({ page = 0, pageSize = 5 }) => {
    const TOKEN = getToken();
    try {
        const response = await axios.get(API_ENDPOINTS.USER.GET_ALL, {
            params: { page, pageSize },
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        return response.content;
    } catch (error) {
        console.log('Error when fetching all user ! Error: ', error);
        message.error('Error get all user: ');
    }
};
