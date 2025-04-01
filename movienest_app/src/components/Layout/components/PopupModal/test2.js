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
    DeleteOutlined,
    EditOutlined,
} from '@ant-design/icons';
import SmartInput from '~/components/Layout/components/SmartInput';
import SmartButton from '~/components/Layout/components/SmartButton';
import PopupModal from '~/components/Layout/components/PopupModal';
import { getAllGenres } from '~/service/admin/genres';
import { Form, message } from 'antd';
import moment from 'moment';

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
    const [modalMode, setModalMode] = useState('create'); // 'create', 'edit' or 'delete'
    const [selectedMovie, setSelectedMovie] = useState(null);    
    const [form] = Form.useForm();

    const handleAddMovie = () => {
        setModalMode('create');
        setSelectedMovie(null);
        form.resetFields(); // Xóa dữ liệu form cũ
        setIsModalOpen(true);
    };

    const handleEditMovie = (record) => {
        console.log('Editing record: ', record);
        setSelectedMovie(record);
        setModalMode('edit');
        
        // Format data để điền vào form
        const formData = {
            ...record,
            // Xử lý releaseDate - chuyển sang moment object cho DatePicker
            releaseDate: record.releaseDate ? moment(record.releaseDate) : null,
            // Xử lý genres - chuyển sang array of IDs nếu cần
            genres: record.genres ? record.genres.map(genre => genre.id) : [],
            // Xử lý posterPath và backdropPath nếu có ảnh
            posterPath: record.posterPath ? [{
                uid: '-1',
                name: 'poster.png',
                status: 'done',
                url: record.posterPath,
            }] : [],
            backdropPath: record.backdropPath ? [{
                uid: '-1',
                name: 'backdrop.png',
                status: 'done',
                url: record.backdropPath,
            }] : [],
        };
        
        // Đặt giá trị cho form
        form.setFieldsValue(formData);
        setIsModalOpen(true);
    };
    
    const handleDeleteMovie = (record) => {
        setSelectedMovie(record);
        setModalMode('delete');
        setIsModalOpen(true);
    };    

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
        {
            title: 'Actions',
            render: (_, record) => (
                <>
                    <SmartButton
                        title="Edit"
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEditMovie(record)}
                    />
                    <SmartButton
                        title="Delete"
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteMovie(record)}
                        style={{ marginLeft: '8px' }}
                    />
                </>
            ),
        },
    ];

    const handleUpdateMovie = async (formData) => {
        try {
            console.log('Updating movie:', formData);
            // Gọi API cập nhật ở đây...
            message.success('Movie updated successfully!');
            handleGetAllMovies();
            setIsModalOpen(false);
        } catch (error) {
            message.error('Failed to update movie.');
        }
    };

    const handleConfirmDelete = async () => {
        try {
            console.log('Deleting movie:', selectedMovie);
            // Gọi API xóa phim ở đây...
            message.success('Movie deleted successfully!');
            handleGetAllMovies();
            setIsModalOpen(false);
        } catch (error) {
            message.error('Failed to delete movie.');
        }
    };

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

    const handleFormSubmit = (formData) => {
        if (modalMode === 'create') {
            handleCreateMovie(formData);
        } else if (modalMode === 'edit') {
            handleUpdateMovie(formData);
        } else if (modalMode === 'delete') {
            handleConfirmDelete();
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

    const getModalTitle = () => {
        switch (modalMode) {
            case 'create':
                return 'Add New Movie';
            case 'edit':
                return 'Edit Movie';
            case 'delete':
                return 'Delete Movie';
            default:
                return 'Movie Details';
        }
    };

    return (
        <div className={cx('movie-wrapper')}>
            <div className={cx('card-header')}>
                <h2>Movie Management</h2>
                <div>
                    <SmartButton
                        title="Add new"
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={handleAddMovie}
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
                    dataSources={movieSources}
                    loading={loading}
                    pagination={pagination}
                    onTableChange={handleTableChange}
                />
            </div>

            {isModalOpen && (
                <PopupModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    title={getModalTitle()}
                    fields={modalMode === 'delete' ? [] : movieFields}
                    genresSources={genresSources}
                    onSubmit={handleFormSubmit}
                    initialValues={selectedMovie}
                    isDeleteMode={modalMode === 'delete'}
                    formInstance={form}
                />
            )}
        </div>
    );
}

export default Movie;

// http://localhost:8080/api/movie/update?movieId=7ae4a794-e5a7-419d-a6ba-8ec0c88dfe13
export const handleUpdateMovie = async (movieId, formData) => {
    const TOKEN = localStorage.getItem('token');

    console.log('id: ', movieId, ' formdata: ', formData);

    try {
        let releaseDate = null;
        if (formData.releaseDate) {
            releaseDate = formData.releaseDate.format
                ? formData.releaseDate.format('YYYY-MM-DD')
                : formData.releaseDate;
        }

        console.log('PUT Method');
        const response = await axios.put(
            `${API_URL}/movie/update/${movieId}`,
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
        console.error(
            'Error updating movie:',
            errorMessage
        );
        throw error;
    }
};