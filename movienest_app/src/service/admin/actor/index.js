import axios from 'axios';
import { message } from 'antd';
import { getToken } from '~/constants/token';
import API_ENDPOINTS from '~/constants/endpoints';

const API_URL = process.env.REACT_APP_API_URL;

export const createActor = async (data) => {
    const TOKEN = localStorage.getItem('token');
    console.log('Token>>>>: ', TOKEN);
    try {
        const response = await axios.post(
            API_ENDPOINTS.ACTOR.CREATE,
            {
                name: data.name,
                character: data.character,
                gender: data.gender,
                biography: data.biography,
                birthday: data.birthday,
                placeOfBirth: data.placeOfBirth,
                profilePath: data.profilePath,
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response) {
            message.success('Actor Create Successfully !');
        }

        return response.data;
    } catch (error) {
        console.error(
            'Error creating actor:',
            error.response ? error.response.data : error,
        );
        throw error;
    }
};

export const getAllPagable = async ({ page = 0, pageSize = 5 }) => {
    const TOKEN = getToken();

    try {
        const response = await axios.get(API_ENDPOINTS.ACTOR.GET_ALL, {
            params: {
                page: page,
                pageSize: pageSize,
            },
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        message.error('Error fetching actor with pageble: ', error);
    }
};

export const getAllActorNoPaging = async () => {
    try {
        const response = await axios.get(API_ENDPOINTS.ACTOR.GET_ALL_NO_PAGING);

        return response.data;
    } catch (error) {
        message.error('Error fetching actor with no pageble: ', error);
    }
};

export const handleUpdateActor = async (actorId, formData) => {
    const TOKEN = getToken();

    try {
        const response = await axios.put(
            API_ENDPOINTS.ACTOR.UPDATE(actorId),
            formData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response) {
            message.success('Actor Updated Successfully !');
        }
        return response.data;
    } catch (error) {
        console.error('Error updating actor:', error);
    }
};

export const deleteActor = async (actorId) => {
    const TOKEN = getToken();

    try {
        await axios.delete(API_ENDPOINTS.ACTOR.DELETE(actorId), {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error deleting movie: ', error);
    }
};
