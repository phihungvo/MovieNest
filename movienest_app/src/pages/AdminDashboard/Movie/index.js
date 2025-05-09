import React, { useState, useEffect } from 'react';
import { Form, message } from 'antd';
import moment from 'moment';
import {
    SearchOutlined,
    PlusOutlined,
    FilterOutlined,
    CloudUploadOutlined,
    DeleteOutlined,
    EditOutlined,
} from '@ant-design/icons';
import styles from './Movie.module.scss';
import {
    getAllMovies,
    createMovie,
    handleUpdateMovie,
    deleteMovie,
} from '~/service/admin/movie';
import { getAllGenres } from '~/service/admin/genres';
import SmartTable from '~/components/Layout/components/SmartTable';
import SmartInput from '~/components/Layout/components/SmartInput';
import SmartButton from '~/components/Layout/components/SmartButton';
import PopupModal from '~/components/Layout/components/PopupModal';
import { getTrailersWithoutMovie } from '~/service/admin/trailer';

const cx = (className) => styles[className];

function Movie() {
    const [movieSources, setMovieSources] = useState([]);
    const [genresSources, setGenresSources] = useState([]);
    const [trailerSources, setTrailerSources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState(null); 
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [form] = Form.useForm();

    const handleAddMovie = () => {
        setModalMode('create');
        setSelectedMovie(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEditMovie = (record) => {
        console.log('Editing record: ', record);
        setSelectedMovie(record);
        setModalMode('edit');

        const formData = {
            ...record,

            voteAverage: record.voteAverage,
            voteCount: record.voteCount,

            // Xử lý releaseDate - chuyển sang moment object cho DatePicker
            releaseDate: record.releaseDate ? moment(record.releaseDate) : null,

            genres: record.genres ? record.genres.map((genre) => genre.id) : [],
            trailers: record.trailers
                ? record.trailers.map((trailer) => trailer.id)
                : [],

            popular: record.popular ? 'Yes' : 'No',
            inTheater: record.inTheater ? 'Yes' : 'No',
            adult: record.adult ? 'Yes' : 'No',

            // Xử lý posterPath và backdropPath nếu có ảnh
            posterPath: record.posterPath
                ? [
                      {
                          uid: '-1',
                          name: 'poster.png',
                          status: 'done',
                          url: record.posterPath,
                      },
                  ]
                : [],

            backdropPath: record.backdropPath
                ? [
                      {
                          uid: '-1',
                          name: 'backdrop.png',
                          status: 'done',
                          url: record.backdropPath,
                      },
                  ]
                : [],
        };

        form.setFieldsValue(formData);
        setIsModalOpen(true);
    };

    const handleDeleteMovie = (record) => {
        setSelectedMovie(record);
        setModalMode('delete');
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'Movie Title',
            dataIndex: 'title',
            key: 'title',
            width: 200,
            fixed: 'left',
        },
        {
            title: 'Release Date',
            dataIndex: 'releaseDate',
            key: 'releaseDate',
            width: 165,

            render: (date) =>
                date ? new Date(date).toLocaleString('vi-VN') : 'N/A',
        },
        {
            title: 'Poster Image',
            dataIndex: 'posterPath',
            key: 'posterPath',
            width: 80,
            render: (url) => (
                <img
                    src={url ? url : '/default-poster.jpg'}
                    alt="poster"
                    style={{ width: '50px' }}
                />
            ),
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            width: 80,
        },
        {
            title: 'Director',
            dataIndex: 'director',
            key: 'director',
            width: 130,
        },
        {
            title: 'Runtime (Minutes)',
            dataIndex: 'runtime',
            key: 'runtime',
            width: 50,
        },
        {
            title: 'Adult',
            dataIndex: 'adult',
            key: 'adult',
            width: 70,
            render: (adult) => (adult ? 'Yes' : 'No'),
        },
        {
            title: 'Vote Average',
            dataIndex: 'voteAverage',
            key: 'voteAverage',
            width: 80,
        },
        {
            title: 'Vote Count',
            dataIndex: 'voteCount',
            key: 'voteCount',
            width: 80,
        },
        {
            title: 'Popular',
            dataIndex: 'popular',
            key: 'popular',
            width: 80,
            render: (popular) => (popular ? 'Yes' : 'No'),
        },
        {
            title: 'Popularity',
            dataIndex: 'popularity',
            key: 'popularity',
            width: 80,
        },
        {
            title: 'In Theater',
            dataIndex: 'inTheater',
            key: 'inTheater',
            width: 80,
            render: (inTheater) => (inTheater ? 'Yes' : 'No'),
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
            title: 'Trailers',
            dataIndex: 'trailers',
            key: 'trailers',
            render: (trailers) =>
                trailers && trailers.length > 0
                    ? trailers.map((trailer) => trailer.title).join(', ')
                    : 'N/A',
        },
        {
            title: 'Actions',
            fixed: 'right',
            width: 200,
            render: (_, record) => (
                <>
                    <SmartButton
                        title="Edit"
                        type="primary"
                        icon={<EditOutlined />}
                        buttonWidth={80}
                        onClick={() => handleEditMovie(record)}
                    />
                    <SmartButton
                        title="Delete"
                        type="danger"
                        icon={<DeleteOutlined />}
                        buttonWidth={80}
                        onClick={() => handleDeleteMovie(record)}
                        // style={{ marginLeft: '8px' }}
                    />
                </>
            ),
        },
    ];

    const countryList = [
        'VIETNAM',
        'THAILAND',
        'KOREA',
        'JAPAN',
        'CHINA',
        'USA',
        'UK',
        'CANADA',
    ];

    const movieModalFields = [
        // 1. Thông tin cơ bản
        {
            label: 'Tiêu đề',
            name: 'title',
            type: 'text',
            rules: [{ required: true, message: 'Tiêu đề là trường bắt buộc!' }],
            placeholder: 'Nhập tiêu đề phim',
        },
        {
            label: 'Quốc gia',
            name: 'country',
            type: 'select',
            options: countryList,
            placeholder: 'Chọn quốc gia',
        },
        {
            label: 'Thời lượng phim',
            name: 'runtime',
            type: 'number',
            min: 0,
        },
        {
            label: 'Đạo diễn',
            name: 'director',
            type: 'text',
        },
        // 2. Đánh giá & phổ biến
        {
            label: 'Điểm đánh giá trung bình',
            name: 'voteAverage',
            type: 'number',
            min: 0,
            max: 10,
            step: 0.1,
        },
        {
            label: 'Số lượt đánh giá',
            name: 'voteCount',
            type: 'number',
            min: 0,
        },
        {
            label: 'Độ phổ biến',
            name: 'popularity',
            type: 'number',
            min: 0,
        },
        {
            label: 'Phổ biến',
            name: 'popular',
            type: 'yesno',
            options: ['Yes', 'No'],
        },
    
        // 3. Thể loại & trailer
        {
            label: 'Thể loại',
            name: 'genres',
            type: 'select',
            multiple: true,
            dataSourceKey: 'genres',
            labelKey: 'name',
            valueKey: 'id',
            placeholder: 'Chọn thể loại phim',
            showSearch: true,
        },
        {
            label: 'Trailers',
            name: 'trailers',
            type: 'select',
            multiple: true,
            dataSourceKey: 'trailers',
            labelKey: 'title',
            valueKey: 'id',
            placeholder: 'Chọn trailer',
            showSearch: true,
        },
    
        // 4. Trạng thái phát hành
        {
            label: 'Dành cho người lớn',
            name: 'adult',
            type: 'yesno',
            options: ['Yes', 'No'],
        },
        {
            label: 'Đang chiếu rạp',
            name: 'inTheater',
            type: 'yesno',
            options: ['Yes', 'No'],
        },
    
        // 5. Media
        {
            label: 'Poster',
            name: 'posterPath',
            type: 'upload',
            accept: 'image/*',
            listType: 'picture-card',
            maxCount: 1,
        },
        {
            label: 'Backdrop',
            name: 'backdropPath',
            type: 'upload',
            accept: 'image/*',
            listType: 'picture-card',
            maxCount: 1,
        },
    
        // 6. Mô tả & ngày công chiếu
        {
            label: 'Mô tả',
            name: 'overview',
            type: 'textarea',
            fullWidth: true,
            rows: 4,
            placeholder: 'Nhập mô tả phim',
        },
        {
            label: 'Ngày công chiếu',
            name: 'releaseDate',
            type: 'date',
            rules: [{ required: true, message: 'Ngày công chiếu là trường bắt buộc!' }],
            format: 'DD/MM/YYYY',
        },
    ];
    

    const prepareDataSources = () => {
        return {
            countries: countryList.map((country) => ({
                label: country,
                value: country,
            })),
            genres: genresSources,
            trailers: trailerSources,
        };
    };

    useEffect(() => {
        handleGetAllMovies();
        handleGetAllGenres();
        handleGetTrailerWithoutMovie();
    }, []);

    const handleTableChange = (pagination) => {
        handleGetAllMovies(pagination.current, pagination.pageSize);
    };

    const handleGetAllMovies = async (page = 1, pageSize = 5) => {
        setLoading(true);
        try {
            const response = await getAllMovies({
                page: page - 1,
                pageSize,
                keyWord: searchKeyword,
            });
            const movieList = response.content;
            // console.log('Movie list search: ', movieList);

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

            handleGetAllMovies();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to create movies:', error);
            message.error(
                'Failed to create movie: ' + (error.message || 'Unknown error'),
            );
        }
    };

    const handleMovieUpdate = async (formData) => {
        try {
            console.log('Form data submitted for update:', formData);

            const response = await handleUpdateMovie(
                selectedMovie.id,
                formData,
            );

            await handleGetTrailerWithoutMovie();
            handleGetAllMovies();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to update movie.');
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteMovie(selectedMovie.id);
            handleGetAllMovies();
            setIsModalOpen(false);
        } catch (error) {
            message.error('Failed to delete movie.');
        }
    };

    const handleFormSubmit = (formData) => {
        if (modalMode === 'create') {
            handleCreateMovie(formData);
        } else if (modalMode === 'edit') {
            handleMovieUpdate(formData);
        } else if (modalMode === 'delete') {
            handleConfirmDelete();
        }
    };

    const handleGetAllGenres = async () => {
        try {
            const response = await getAllGenres();
            console.log('Genres ', response);
            if (response) {
                setGenresSources(response);
            } else {
                console.error('No genres data available');
            }
        } catch (error) {
            console.error('Failed to get all genres:', error);
        }
    };

    const handleGetTrailerWithoutMovie = async () => {
        try {
            const response = await getTrailersWithoutMovie();

            const trailerList = response;

            setTrailerSources(trailerList);
         
        } catch (error) {
            console.error('Failed to get all trailers:', error);
        }
    };

    const handleSearch = () => {
        handleGetAllMovies(1, pagination.pageSize);
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

    const processFormData = async (values) => {
        values.popular = values.popular === 'Yes';
        values.inTheater = values.inTheater === 'Yes';
        values.adult = values.adult === 'Yes';

        console.log('Values from form: ', values);
        return values;
    };

    const handleClearSearch = () => {
        setSearchKeyword('');
        handleGetAllMovies(1, pagination.pageSize);
    };

    return (
        <div className={cx('movie-wrapper')}>
            <div className={cx('sub_header')}>
                <SmartInput
                    size="large"
                    placeholder="Tìm kiếm phim"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onPressEnter={handleSearch}
                    icon={<SearchOutlined />}
                    allowClear
                    onClear={handleClearSearch}
                />
                <div className={cx('features')}>
                    <SmartButton
                        title="Add new"
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={handleAddMovie}
                    />
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

            <PopupModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                title={getModalTitle()}
                fields={modalMode === 'delete' ? [] : movieModalFields}
                dataSources={prepareDataSources()}
                onSubmit={handleFormSubmit}
                initialValues={selectedMovie}
                isDeleteMode={modalMode === 'delete'}
                formInstance={form}
                onBeforeSubmit={processFormData}
            />
            {/* )} */}
        </div>
    );
}

export default Movie;
