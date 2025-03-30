import React from 'react';
import classNames from 'classnames/bind';
import styles from './Movie.module.scss';
import { useState, useEffect } from 'react';
import { getAllMovies, createMovie } from '~/service/admin/movie';
import SmartTable from '~/components/Layout/components/SmartTable';
import {
    SearchOutlined,
    PlusOutlined,
    FilterOutlined,
    CloudUploadOutlined,
} from '@ant-design/icons';
import SmartInput from '~/components/Layout/components/SmartInput';
import SmartButton from '~/components/Layout/components/SmartButton';
import PopupModal from '~/components/Layout/components/PopupModal';
import { getAllGenres } from '~/service/admin/genres';
import { Form, message } from 'antd';

const cx = classNames.bind(styles);

function Movie() {
    const [movieSources, setMovieSources] = useState([]);
    const [genresSources, setGenresSources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        { title: 'Movie Title', dataIndex: 'title', key: 'title', width: 250 },
        {
            title: 'Release Date',
            dataIndex: 'releaseDate',
            key: 'releaseDate',
            width: 200,
            render: (date) =>
                date ? new Date(date).toLocaleString('vi-VN') : 'N/A',
        },
        {
            title: 'Poster Image',
            dataIndex: 'posterPath',
            key: 'posterPath',
            width: 200,
            render: (url) => (
                <img
                    src={url ? url : '/default-poster.jpg'}
                    alt="poster"
                    style={{ width: '50px' }}
                />
            ),
        },
        {
            title: 'Vote Average',
            dataIndex: 'vote_average',
            key: 'vote_average',
            width: 150,
        },
        {
            title: 'Vote Count',
            dataIndex: 'vote_count',
            key: 'vote_count',
            width: 150,
        },
        {
            title: 'Genres',
            dataIndex: 'genres',
            key: 'genres',
            render: (genres) =>
                genres && genres.length > 0
                    ? genres.map((genre) => genre.name).join(', ')
                    : 'N/A',
        },
    ];

    const movieFields = [
        {
            label: 'Title',
            name: 'title',
            type: 'text',
            rules: [{ required: true, message: 'Title is required!' }],
        },
        { label: 'Vote Average', name: 'voteAverage', type: 'number' },
        { label: 'Vote Count', name: 'voteCount', type: 'number' },
        {
            label: 'Genres',
            name: 'genres',
            type: 'select',
            options:
                Array.isArray(genresSources) && genresSources.length > 0
                    ? genresSources.map((genre) => ({
                          label: genre.name,
                          value: genre.id,
                      }))
                    : [],
        },
        { label: 'Overview', name: 'overview', type: 'textarea' },
        { label: 'Poster', name: 'posterPath', type: 'upload' },
        { label: 'Backdrop', name: 'backdropPath', type: 'upload' },
        {
            label: 'Release Date',
            name: 'releaseDate',
            type: 'date',
            rules: [{ required: true, message: 'Release date is required!' }],
        },
        // { label: 'Rate', name: 'rate', type: 'rate' },
    ];

    useEffect(() => {
        handleGetAllMovies();
        handleGetAllGenres();
    }, []);

    const handleTableChange = (pagination) => {
        handleGetAllMovies(pagination.current, pagination.pageSize);
    };

    const handleGetAllMovies = async (page = 1, pageSize = 5) => {
        setLoading(true);
        try {
            const response = await getAllMovies({ page, pageSize });
            console.log('Movies Data:', response);
            const movieList = response.content;

            if (Array.isArray(movieList)) {
                setMovieSources(movieList);
                setPagination((prev) => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize,
                    total: response.totalElements,
                }));
            } else {
                console.error('Invalid data format:', response);
                setMovieSources([]);
            }
        } catch (error) {
            console.error('Failed to fetch movies:', error);
            setMovieSources([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMovie = async (formData) => {
        try {
            console.log('Form data submitted:', formData); 

            const response = await createMovie(formData);

            console.log('Create movie response: ', response);

            if (response) {
                message.success('Movie created successfully!');
                handleGetAllMovies();
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error('Failed to create movies:', error);
            message.error(
                'Failed to create movie: ' + (error.message || 'Unknown error'),
            );
        }
    };

    const handleGetAllGenres = async () => {
        try {
            const response = await getAllGenres();
            if (response) {
                setGenresSources(response);
            } else {
                console.error('No genres data available');
            }
        } catch (error) {
            console.error('Failed to get all genres:', error);
        }
    };

    return (
        <div className={cx('movie-wrapper')}>
            <div className={cx('card-header')}>
                <h2>Movie Management</h2>
                <div>
                    {/* <Button type="primary">Add new</Button> */}
                    <SmartButton
                        title="Add new"
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => setIsModalOpen(true)}
                    />
                    <PopupModal
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        title="Create Movie"
                        fields={movieFields}
                        genresSources={genresSources}
                        onSubmit={handleCreateMovie}
                    />
                </div>
            </div>
            <hr
                style={{
                    borderColor: '#e5e7eb',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                }}
            />
            <div className={cx('sub_header')}>
                <SmartInput
                    size="large"
                    placeholder="Search"
                    icon={<SearchOutlined />}
                />
                <div className={cx('features')}>
                    <SmartButton title="Bộ lọc" icon={<FilterOutlined />} />
                    <SmartButton title="Excel" icon={<CloudUploadOutlined />} />
                </div>
            </div>
            <div className={cx('movie-container')}>
                <SmartTable
                    columns={columns}
                    movieSources={movieSources}
                    loading={loading}
                    pagination={pagination}
                    onTableChange={handleTableChange}
                />
            </div>
        </div>
    );
}

export default Movie;
