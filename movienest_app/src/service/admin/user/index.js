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
    }
};

export const getAllUser = async ({ page = 0, pageSize = 5 }) => {
    try {
        const response = await axios.get(API_ENDPOINTS.USER.GET_ALL, {
            params: { page, pageSize },
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('user response: ', response.data);
        return response.data;
    } catch (error) {
        console.log('Error when fetching all user ! Error: ', error);
        message.error('Error get all user: ');
    }
};

export const createUser = async (formData) => {
    try {
        const response = await axios.post(
            API_ENDPOINTS.USER.CREATE,
            {
                ...formData,
                roles: formData.roles.split(',').map((role) => role.trim()),
            },
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response.status == 200){
            message.success('User create successfully!')
        }

        return response.data;
    } catch (error) {
        const messageError = error.response.data.message;
        console.log('Error when fetching all user ! Error: ', messageError);
        message.error(messageError);
    }
};

export const updateUser = async (userId, formData) => {
    try {
        const response = await axios.put(
            API_ENDPOINTS.USER.UPDATE(userId),
            {
                ...formData,
                roles: formData.roles.split(',').map((role) => role.trim()),
            },{
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            }
        )

        if (response.status === 200)
            message.success(response.data);
    }catch (error){
        console.log('Error when fetching all user ! Error: ', error);
    }
}