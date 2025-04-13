import axios from 'axios';
import { message } from 'antd';

const API_URL = process.env.REACT_APP_API_URL;

// http://localhost:8080/api/actor/create
export const createActor = async (data) => {
    const TOKEN = localStorage.getItem('token');

    try {
        const response = await axios.post(
            `${API_URL}/actor/create`,
            {
                name: data.name,
                charater: data.charater,
                gender: data.gender,
                biography: data.biography,
                birthday: data.birthday,
                placeOfBirth: data.placeOfBirth,
                profilePath: data.profilePath
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        message.success('Movie Created:', response.data);
        return response.data;
    } catch (error) {
        console.error(
            'Error creating actor:',
            error.response ? error.response.data : error,
        );
        throw error;
    }
};

// http://localhost:8080/api/actor/getAllPagable
export const getAllPagable = async ({page = 0, pageSize = 5}) => {
    const TOKEN = localStorage.getItem('token');

    try {
        const response = await axios.get(`${API_URL}/actor/getAllPagable`, {
            params: {
                page: page,
                pageSize: pageSize,
            },
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        })
        return response.data;
    }catch (error){
        console.error(
            'Error fetching actor with pageble: ',
            error.response ? error.response.data : error,
        );
        throw error;
    }
}

// http://localhost:8080/api/actor/findAll
export const getAllActorNoPaging = async () => {

    const TOKEN = localStorage.getItem('token');

    try {
        const response = await axios.get(`${API_URL}/actor/findAll`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        const actors = response.data;
        // const moviearr = actors.map((movie, index) => (
        //     {
        //         id: movie.id,
        //         name: movie.title,
        //     }
        // ))

        // console.log('Movie arr : ', moviearr)

        return actors;
    } catch (error) {
        console.error(
            'Error find all actor:',
            error.response ? error.response.data : error,
        );
        throw error;
    }
}

// http://localhost:8080/api/actor/update/074548c9-1a56-4fd5-9e18-f9aaae1c8f7e
export const handleUpdateActor = async (actorId, formData) => {
    const TOKEN = localStorage.getItem('token');

    console.log('id: ', actorId);
    console.log('form data: ', formData)

    try {
        const response = await axios.put(
            `${API_URL}/actor/update/${actorId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        console.log('response: ', response.data);
        return response.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || 'Something went wrong';

        message.error(`${errorMessage}`);
        console.error('Error updating movie:', errorMessage);
        throw error;
    }
};

// http://localhost:8080/api/actor/delete/074548c9-1a56-4fd5-9e18-f9aaae1c8f7e
export const deleteActor = async (actorId) => {
    const TOKEN = localStorage.getItem('token');

    console.log('Delete actor id: ', actorId);

    try {
        const response = await axios.delete(`${API_URL}/actor/delete`, {
            params: {
                actorId: actorId,
            },
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('response: ', response.data);
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || 'Something went wrong';

        message.error(`${errorMessage}`);
        console.error('Error deleting movie:', errorMessage);
        throw error;
    }
};
