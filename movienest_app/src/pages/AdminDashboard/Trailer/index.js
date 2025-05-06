import React from 'react';
import classNames from 'classnames/bind';
import styles from './Trailer.module.scss';
import { useState, useEffect } from 'react';
import moment from 'moment';
import SmartTable from '~/components/Layout/components/SmartTable';
import {
    SearchOutlined,
    PlusOutlined,
    FilterOutlined,
    CloudUploadOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import SmartInput from '~/components/Layout/components/SmartInput';
import SmartButton from '~/components/Layout/components/SmartButton';
import PopupModal from '~/components/Layout/components/PopupModal';
import { Form, message } from 'antd';
import {
    getAllTrailers,
    createTrailers,
    handleUpdateTrailer,
    deleteTrailer,
} from '~/service/admin/trailer';
import { findAllMovieNoPaging } from '~/service/admin/movie';

const cx = classNames.bind(styles);

function Trailer() {
    const [trailerSources, setTrailerSources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [selectedTrailer, setSelectedTrailer] = useState(null);
    const [movieSource, setMovieSource] = useState([]);
    const [modalMode, setModalMode] = useState('create');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [form] = Form.useForm();

    const handleAddTrailer = () => {
        setModalMode('create');
        setSelectedTrailer(null);
        handleGetAllMovie();
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEditTrailer = async (record) => {
        // console.log('Editing record: ', record);
        setSelectedTrailer(record);
        setModalMode('edit');

        try {
            const movies = await findAllMovieNoPaging();
            setMovieSource(movies);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setMovieSource([]);
        }

        const formData = {
            ...record,

            official: record.official ? 'Yes' : 'No',

            publishedAt: record.publishedAt ? moment(record.publishedAt) : null,

            trailerType: record.trailerType || record.type,

            movies: record.movie
                ? { label: record.movie.title, value: record.movie.id }
                : null,
        };

        console.log('form: ', formData);

        form.setFieldsValue(formData);
        setIsModalOpen(true);
    };

    const handleDeleteTrailer = (record) => {
        setSelectedTrailer(record);
        setModalMode('delete');
        setIsModalOpen(true);
    };

    const handleGetAllMovie = async () => {
        try {
            // console.log('Start get all movie');
            const movieData = await findAllMovieNoPaging();
            setMovieSource(movieData);
            // console.log('Movie: ', response);
        } catch (error) {
            console.error('Failed to get all movies:', error);
        }
    };

    const columns = [
        {
            title: 'Trailer Title',
            dataIndex: 'title',
            key: 'title',
            width: 200,
            fixed: 'left',
        },
        {
            title: 'Key',
            dataIndex: 'keyDisplay',
            key: 'keyDisplay',
            width: 150,
        },
        { title: 'Site', dataIndex: 'site', key: 'site', width: 150 },
        {
            title: 'Type',
            dataIndex: 'trailerType',
            key: 'trailerType',
            width: 200,
        },
        {
            title: 'Official',
            dataIndex: 'official',
            key: 'official',
            width: 100,
            render: (official) => (official ? 'YES' : 'NO'),
        },
        // { title: 'Movie', dataIndex: 'movie', key: 'movie', width: 250 },
        // {
        //     title: 'Movie',
        //     dataIndex: 'movies',
        //     key: 'movies',
        //     width: 100,
        //     render: (movies) =>
        //         movies && movies.length > 0
        //             ? movies.map((movie) => movie.name).join(', ')
        //             : 'N/A',
        // },
        {
            title: 'Publish At',
            dataIndex: 'publishedAt',
            key: 'publishedAt',
            width: 200,
            render: (date) =>
                date ? new Date(date).toLocaleString('vi-VN') : 'N/A',
        },
        {
            title: 'Actions',
            fixed: 'right',
            render: (_, record) => (
                <>
                    <SmartButton
                        title="Edit"
                        type="primary"
                        icon={<EditOutlined />}
                        buttonWidth={80}
                        onClick={() => handleEditTrailer(record)}
                    />
                    <SmartButton
                        title="Delete"
                        type="danger"
                        icon={<DeleteOutlined />}
                        buttonWidth={80}
                        onClick={() => handleDeleteTrailer(record)}
                        style={{ marginLeft: '8px' }}
                    />
                </>
            ),
        },
    ];

    const trailerModalFields = [
        {
            label: 'Trailer Title',
            name: 'title',
            type: 'text',
            rules: [{ required: true, message: 'Title is required!' }],
        },
        {
            label: 'Trailer URL Key',
            name: 'key',
            type: 'text',
            rules: [{ required: true, message: 'Key is required!' }],
        },
        {
            label: 'Site',
            name: 'site',
            type: 'text',
            rules: [{ required: true, message: 'Site is required!' }],
        },
        {
            label: 'Type',
            name: 'trailerType',
            type: 'select',
            rules: [{ required: true, message: 'Trailer Type is required!' }],
            options: [
                'TEASER',
                'OFFICIAL',
                'CLIP',
                'FEATURETTE',
                'BTS',
                'INTERVIEW',
                'CUSTOM',
                'BEHIND_THE_SCENES',
            ],
        },
        {
            label: 'Official',
            name: 'official',
            type: 'yesno',
            options: ['YES', 'NO'],
            // render: (official) => (official ? 'YES' : 'NO'),
        },
        // {
        //     label: 'Movies',
        //     name: 'movies',
        //     type: 'select',
        //     multiple: false,
        //     dataSourceKey: 'movies',
        //     labelKey: 'title',
        //     valueKey: 'id',
        //     placeholder: 'Chọn thể loại phim',
        //     showSearch: true,
        // },
        {
            label: 'Publish At',
            name: 'publishedAt',
            type: 'date',
            rules: [{ required: true, message: 'Publish At is required!' }],
        },
    ];

    useEffect(() => {
        handleGetAllTrailers();
        handleGetAllMovie();
    }, []);

    const handleTableChange = (pagination) => {
        handleGetAllTrailers(pagination.current, pagination.pageSize);
    };

    const handleGetAllTrailers = async (page = 1, pageSize = 5) => {
        setLoading(true);
        try {
            const response = await getAllTrailers({
                page: page - 1,
                pageSize,
                keyWord: searchKeyword,
            });
            const trailerList = response.content;

            if (response && Array.isArray(trailerList)) {
                const transformedTrailers = trailerList.map((trailer) => {
                    return {
                        ...trailer,
                        keyDisplay: trailer.key,
                    };
                });

                setTrailerSources(transformedTrailers);
                setPagination((prev) => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize,
                    total: response.totalElements,
                }));
            } else {
                console.error('Invalid data trailers: ', response);
                setTrailerSources([]);
            }

            // console.log('All trailers: ', response);
        } catch (error) {
            console.error('Error fetching trailers', error);
            setTrailerSources([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTrailer = async (formData) => {
        try {
            console.log('Form data submitted:', formData);

            const response = await createTrailers(formData);

            console.log('response: ', response);

            form.resetFields();
            handleGetAllTrailers();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to create trailer:', error);
            message.error(
                'Failed to create trailer: ' +
                    (error.message || 'Unknown error'),
            );
        }
    };

    const handleTrailerUpdate = async (formData) => {
        try {
            const response = await handleUpdateTrailer(
                selectedTrailer.id,
                formData,
            );
            if (response){
                message.success('Trailer updated successfully!');
            }

            setIsModalOpen(false);
            form.resetFields();
            handleGetAllTrailers();
        } catch (error) {
            console.error('Failed to update trailer.');
            message.error(
                'Failed to update trailer: ' +
                    (error.message || 'Unknown error'),
            );
        }
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await deleteTrailer(selectedTrailer.id);

            handleGetAllTrailers();
            setIsModalOpen(false);
        } catch (error) {
            message.error('Failed to delete trailer.');
        }
    };

    const handleSearch = () => {
        handleGetAllTrailers(1, pagination.pageSize);
    };

    const handleClearSearch = () => {
        setSearchKeyword('');
        handleGetAllTrailers(1, pagination.pageSize);
    };

    const handleFormSubmit = (formData) => {
        if (modalMode === 'create') {
            handleCreateTrailer(formData);
            console.log('form data:: ', formData)
        } else if (modalMode === 'edit') {
            handleTrailerUpdate(formData);
        } else if (modalMode === 'delete') {
            handleConfirmDelete();
        }
    };

    const getModalTitle = () => {
        switch (modalMode) {
            case 'create':
                return 'Add New Trailer';
            case 'edit':
                return 'Edit Trailer';
            case 'delete':
                return 'Delete Trailer';
            default:
                return 'Trailer Details';
        }
    };

    const processFormData = async (values) => {
        values.official = values.official === 'YES';
        return values;
    };

    return (
        <div className={cx('trailer-wrapper')}>
            <div className={cx('sub_header')}>
                <SmartInput
                    size="large"
                    placeholder="Tìm kiếm trailer"
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
                        onClick={handleAddTrailer}
                    />
                    <SmartButton title="Bộ lọc" icon={<FilterOutlined />} />
                    <SmartButton title="Excel" icon={<CloudUploadOutlined />} />
                </div>
            </div>
            <div className={cx('trailer-container')}>
                <SmartTable
                    columns={columns}
                    dataSources={trailerSources}
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
                    fields={modalMode === 'delete' ? [] : trailerModalFields}
                    dataSources={movieSource}
                    onBeforeSubmit={processFormData}
                    onSubmit={handleFormSubmit}
                    initialValues={selectedTrailer}
                    isDeleteMode={modalMode === 'delete'}
                    formInstance={form}
                />
            )}
        </div>
    );
}

export default Trailer;
