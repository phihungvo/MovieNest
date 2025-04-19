import axios from 'axios';
import { message } from 'antd';
import API_ENDPOINTS from '../../../constants/endpoints';
import { getToken } from '~/constants/token';
import { uploadFile } from '../uploadFile';

const API_URL = process.env.REACT_APP_API_URL;

// Sửa lỗi trong hàm searchMovieByKeyWord
export const searchMovieByKeyWord = async (keyWord) => {
    const TOKEN = localStorage.getItem('token');

    try {
        console.log('Start searching with keyword:', keyWord);
        const response = await axios.post(
            API_ENDPOINTS.MOVIES.SEARCH(keyWord),
            {},
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error searching movie: ', error);
    }
};

export const getAllMovies = async ({ page = 0, pageSize = 5 }) => {
    const TOKEN = getToken();

    try {
        const response = await axios.get(API_ENDPOINTS.MOVIES.GET_ALL, {
            params: { page, pageSize },
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching movies: ', error);
    }
};

// http://localhost:8080/api/movie/findAllNoPaging
export const findAllMovieNoPaging = async () => {
    const TOKEN = getToken();

    try {
        const response = await axios.get(
            API_ENDPOINTS.MOVIES.GET_ALL_NO_PAGING,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        const movies = response.data;
        const moviearr = movies.map((movie, index) => ({
            id: movie.id,
            name: movie.title,
        }));

        return moviearr;
    } catch (error) {
        console.error('Error find all movie: ', error);
    }
};

export const createMovie = async (formData) => {
    const TOKEN = getToken();

    try {
        let releaseDate = null;
        if (formData.releaseDate) {
            releaseDate = formData.releaseDate.format
                ? formData.releaseDate.format('YYYY-MM-DD')
                : formData.releaseDate;
        }

        // Process poster image
        let posterPath = formData.posterPath;
        if (posterPath) {
            if (posterPath.originFileObj) {
                // New file upload
                const posterResult = await uploadFile(posterPath.originFileObj);
                posterPath = posterResult.url;
            } else if (posterPath.url) {
                // Existing image from form
                posterPath = posterPath.url;
            } else if (Array.isArray(posterPath) && posterPath.length > 0) {
                // Handle array format (from Ant Design Upload)
                if (posterPath[0].originFileObj) {
                    const posterResult = await uploadFile(
                        posterPath[0].originFileObj,
                    );
                    posterPath = posterResult.url;
                } else if (posterPath[0].url) {
                    posterPath = posterPath[0].url;
                }
            }
            // If posterPath is already a string URL, keep it as is
        }

        // Process backdrop image
        let backdropPath = formData.backdropPath;
        if (backdropPath) {
            if (backdropPath.originFileObj) {
                // New file upload
                const backdropResult = await uploadFile(
                    backdropPath.originFileObj,
                );
                backdropPath = backdropResult.url;
            } else if (backdropPath.url) {
                // Existing image from form
                backdropPath = backdropPath.url;
            } else if (Array.isArray(backdropPath) && backdropPath.length > 0) {
                // Handle array format (from Ant Design Upload)
                if (backdropPath[0].originFileObj) {
                    const backdropResult = await uploadFile(
                        backdropPath[0].originFileObj,
                    );
                    backdropPath = backdropResult.url;
                } else if (backdropPath[0].url) {
                    backdropPath = backdropPath[0].url;
                }
            }
            // If backdropPath is already a string URL, keep it as is
        }

        console.log(
            'Final posterPath and backdropPath: ',
            posterPath,
            ' : ',
            backdropPath,
        );

        const response = await axios.post(
            API_ENDPOINTS.MOVIES.CREATE,
            {
                title: formData.title,
                overview: formData.overview,
                releaseDate: releaseDate,
                posterPath: posterPath,
                backdropPath: backdropPath,
                country: formData.country,
                voteAverage: formData.voteAverage || 0,
                voteCount: formData.voteCount || 0,
                popularity: formData.popularity || 0,
                popular: formData.popular === 'Yes',
                adult: formData.adult === 'Yes',
                inTheater: formData.inTheater === 'Yes',
                genres: formData.genres,
                trailers: formData.trailers || [],
                comments: formData.comments || [],
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response.data) {
            message.success('Movie created successfully!');
        }
        return response.data;
    } catch (error) {
        message.error(
            'Error creating movie: ' + (error.message || 'Unknown error'),
        );
        throw error;
    }
};

// http://localhost:8080/api/movie/update/0bde48a3-1dbc-4174-95ec-d9753cd5ec3d
export const handleUpdateMovie = async (movieId, formData) => {
    const TOKEN = getToken();

    try {
        let releaseDate = null;
        if (formData.releaseDate) {
            releaseDate = formData.releaseDate.format
                ? formData.releaseDate.format('YYYY-MM-DD')
                : formData.releaseDate;
        }

        // Process poster image
        let posterPath = formData.posterPath;
        if (posterPath) {
            if (posterPath.originFileObj) {
                try {
                    // New file upload
                    const posterResult = await uploadFile(
                        posterPath.originFileObj,
                    );
                    posterPath = posterResult.url;
                    console.log(
                        `Poster image ${
                            posterResult.alreadyExists
                                ? 'already exists'
                                : 'uploaded'
                        }: ${posterPath}`,
                    );
                } catch (uploadError) {
                    // If upload fails due to file already existing, try to get the URL
                    if (
                        uploadError.response &&
                        uploadError.response.data &&
                        uploadError.response.data.message &&
                        uploadError.response.data.message.includes(
                            'already exists',
                        )
                    ) {
                        console.log(
                            'Poster file already exists, using existing URL',
                        );
                        posterPath = `${API_URL}/storage/files/${posterPath.originFileObj.name}`;
                    } else {
                        throw uploadError;
                    }
                }
            } else if (posterPath.url) {
                // Existing image from form
                posterPath = posterPath.url;
            } else if (Array.isArray(posterPath) && posterPath.length > 0) {
                // Handle array format (from Ant Design Upload)
                if (posterPath[0].originFileObj) {
                    try {
                        const posterResult = await uploadFile(
                            posterPath[0].originFileObj,
                        );
                        posterPath = posterResult.url;
                        console.log(
                            `Poster image ${
                                posterResult.alreadyExists
                                    ? 'already exists'
                                    : 'uploaded'
                            }: ${posterPath}`,
                        );
                    } catch (uploadError) {
                        // If upload fails due to file already existing, try to get the URL
                        if (
                            uploadError.response &&
                            uploadError.response.data &&
                            uploadError.response.data.message &&
                            uploadError.response.data.message.includes(
                                'already exists',
                            )
                        ) {
                            console.log(
                                'Poster file already exists, using existing URL',
                            );
                            posterPath = `${API_URL}/storage/files/${posterPath[0].originFileObj.name}`;
                        } else {
                            throw uploadError;
                        }
                    }
                } else if (posterPath[0].url) {
                    posterPath = posterPath[0].url;
                }
            }
            // If posterPath is already a string URL, keep it as is
        }

        // Process backdrop image (same logic as poster)
        let backdropPath = formData.backdropPath;
        if (backdropPath) {
            if (backdropPath.originFileObj) {
                try {
                    // New file upload
                    const backdropResult = await uploadFile(
                        backdropPath.originFileObj,
                    );
                    backdropPath = backdropResult.url;
                    console.log(
                        `Backdrop image ${
                            backdropResult.alreadyExists
                                ? 'already exists'
                                : 'uploaded'
                        }: ${backdropPath}`,
                    );
                } catch (uploadError) {
                    // If upload fails due to file already existing, try to get the URL
                    if (
                        uploadError.response &&
                        uploadError.response.data &&
                        uploadError.response.data.message &&
                        uploadError.response.data.message.includes(
                            'already exists',
                        )
                    ) {
                        console.log(
                            'Backdrop file already exists, using existing URL',
                        );
                        backdropPath = `${API_URL}/storage/files/${backdropPath.originFileObj.name}`;
                    } else {
                        throw uploadError;
                    }
                }
            } else if (backdropPath.url) {
                // Existing image from form
                backdropPath = backdropPath.url;
            } else if (Array.isArray(backdropPath) && backdropPath.length > 0) {
                // Handle array format (from Ant Design Upload)
                if (backdropPath[0].originFileObj) {
                    try {
                        const backdropResult = await uploadFile(
                            backdropPath[0].originFileObj,
                        );
                        backdropPath = backdropResult.url;
                        console.log(
                            `Backdrop image ${
                                backdropResult.alreadyExists
                                    ? 'already exists'
                                    : 'uploaded'
                            }: ${backdropPath}`,
                        );
                    } catch (uploadError) {
                        // If upload fails due to file already existing, try to get the URL
                        if (
                            uploadError.response &&
                            uploadError.response.data &&
                            uploadError.response.data.message &&
                            uploadError.response.data.message.includes(
                                'already exists',
                            )
                        ) {
                            console.log(
                                'Backdrop file already exists, using existing URL',
                            );
                            backdropPath = `${API_URL}/storage/files/${backdropPath[0].originFileObj.name}`;
                        } else {
                            throw uploadError;
                        }
                    }
                } else if (backdropPath[0].url) {
                    backdropPath = backdropPath[0].url;
                }
            }
            // If backdropPath is already a string URL, keep it as is
        }

        console.log(
            'Final posterPath and backdropPath: ',
            posterPath,
            ' : ',
            backdropPath,
        );

        console.log('Updating movie with data:', formData);

        const response = await axios.put(
            API_ENDPOINTS.MOVIES.UPDATE(movieId),
            formData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response.data) {
            message.success('Movie updated successfully!');
        }
        return response.data;
    } catch (error) {
        message.error(
            'Error updating movie: ' + (error.message || 'Unknown error'),
        );
        throw error;
    }
};

export const findAllKoreanMovies = async () => {
    const TOKEN = getToken();

    try {
        const response = await axios.get(
            API_ENDPOINTS.MOVIES.KOREAN_MOVIES,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );  

        console.log('Korean movies: ', response)

        return response.data;
    } catch (error) {
        console.error('Error find all movie: ', error);
    }
};

// http://localhost:8080/api/movie/delete?movieId=17a1c81c-be64-4229-ac64-c4ffa4ffb5e9
export const deleteMovie = async (movieId) => {
    const TOKEN = getToken();

    try {
        const response = await axios.delete(
            API_ENDPOINTS.MOVIES.DELETE(movieId),
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            },
        );
    } catch (error) {
        message.error('Error deleting movie:', error);
    }
};
