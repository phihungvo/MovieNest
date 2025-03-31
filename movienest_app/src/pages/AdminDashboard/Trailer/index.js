import React from 'react';
import classNames from 'classnames/bind';
import styles from './Trailer.module.scss';
import { useState, useEffect } from 'react';
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
import { Form, message } from 'antd';
import { getAllTrailers, createTrailers } from '~/service/admin/trailer';

const cx = classNames.bind(styles);

function Trailer() {
    // const [movieSources, setMovieSources] = useState([]);
    const [trailerSources, setTrailerSources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Trailer Title',
            dataIndex: 'title',
            key: 'title',
            width: 250,
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
            width: 250,
        },
        {
            title: 'Official',
            dataIndex: 'official',
            key: 'official',
            width: 250,
        },
        { title: 'Movie', dataIndex: 'movie', key: 'movie', width: 250 },
        {
            title: 'Publish At',
            dataIndex: 'publishedAt',
            key: 'publishedAt',
            width: 200,
            render: (date) =>
                date ? new Date(date).toLocaleString('vi-VN') : 'N/A',
        },
    ];

    console.log('colums: ', columns);

    const movieFields = [
        {
            label: 'Trailer Title',
            name: 'title',
            type: 'text',
            rules: [{ required: true, message: 'Title is required!' }],
        },
        { label: 'Trailer URL Key', name: 'key', type: 'text' },
        { label: 'Site', name: 'site', type: 'text' },
        { label: 'Type', name: 'type', type: 'text' },
        {
            label: 'Official',
            name: 'official',
            type: 'boolean',
            render: (official) => (official ? 'YES' : 'NO'),
        },
        // { label: 'Movie', name: 'movie', type: 'text' },
        {
            label: 'Publish At',
            name: 'publishedAt',
            type: 'date',
            rules: [{ required: true, message: 'Publish At is required!' }],
        },
    ];

    console.log('movieFields: ', movieFields);

    useEffect(() => {
        handleGetAllTrailers();
    }, []);

    const handleGetAllTrailers = async (page = 1, pageSize = 5) => {
        setLoading(true);
        try {
            const response = await getAllTrailers({ page: page - 1, pageSize });
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

            console.log('All trailers: ', response);
        } catch (error) {
            console.errÍor('Error fetching trailers', error);
            setTrailerSources([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (pagination) => {
        handleGetAllTrailers(pagination.current, pagination.pageSize);
    };

    const handleCreateTrailer = async (formData) => {
        try {
            console.log('Form data submitted:', formData);

            const response = await createTrailers(formData);

            if (response) {
                message.success('Trailer created successfully!');
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error('Failed to create trailer:', error);
            message.error(
                'Failed to create trailer: ' + (error.message || 'Unknown error'),
            );
        }
    };

    // const handleGetAllGenres = async () => {
    //     try {
    //         const response = await getAllGenres();
    //         if (response) {
    //             setGenresSources(response);
    //         } else {
    //             console.error('No genres data available');
    //         }
    //     } catch (error) {
    //         console.error('Failed to get all genres:', error);
    //     }
    // };

    return (
        <div className={cx('trailer-wrapper')}>
            <div className={cx('trailer-header')}>
                <h2>Trailer Management</h2>
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
                        title="Create Trailer"
                        fields={movieFields}
                        // genresSources={genresSources}
                        onSubmit={handleCreateTrailer}
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
                    dataSources={trailerSources}
                    loading={loading}
                    pagination={pagination}
                    onTableChange={handleTableChange}
                />
            </div>
        </div>
    );
}

export default Trailer;
