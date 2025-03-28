import React from 'react';
import classNames from 'classnames/bind';
import styles from './Movie.module.scss';
import { useState, useEffect } from 'react';
import { getAllMovies } from '~/service/admin/movie';
import SmartTable from '~/components/Layout/components/SmartTable';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import SmartInput from '~/components/Layout/components/SmartInput';
import SmartButton from '~/components/Layout/components/SmartButton';

const cx = classNames.bind(styles);

function Movie() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });

    const columns = [
        { title: 'Title', dataIndex: 'title', key: 'title', width: 250 },
        {
            title: 'Release Date',
            dataIndex: 'releaseDate',
            key: 'releaseDate',
            width: 200,
            render: (date) =>
                date ? new Date(date).toLocaleString('vi-VN') : 'N/A',
        },
        {
            title: 'Poster',
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

    const handleCallApi = async (page = 1, pageSize = 5) => {
        setLoading(true);
        try {
            const response = await getAllMovies({ page, pageSize });
            console.log('Movies Data:', response);
            const movieList = response.content;

            if (Array.isArray(movieList)) {
                setDataSource(movieList);
                setPagination((prev) => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize,
                    total: response.totalElements,
                }));
            } else {
                console.error('Invalid data format:', response);
                setDataSource([]);
            }
        } catch (error) {
            console.error('Failed to fetch movies:', error);
            setDataSource([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleCallApi();
    }, []);

    const handleTableChange = (pagination) => {
        handleCallApi(pagination.current, pagination.pageSize);
    };

    // const totalColumnWidth = columns.reduce((sum, col) => sum + col.width, 0);
    // const scrollX = totalColumnWidth > window.innerWidth * 0.8 ? totalColumnWidth : '100%';

    return (
        <div className={cx('movie-wrapper')}>
            <div className={cx('card-header')}>
                <h2>Movie Management</h2>
                <div>
                    {/* <Button type="primary">Add new</Button> */}
                    <SmartButton title='Add new' icon={<PlusOutlined />} />
                </div>
            </div>
            <div>
                <SmartInput
                    size="large"
                    placeholder="Search"

                    icon={<SearchOutlined/>}
                />
            </div>
            <div className={cx('movie-container')}>
                <SmartTable
                    columns={columns}
                    dataSource={dataSource}
                    loading={loading}
                    pagination={pagination}
                    onTableChange={handleTableChange}
                />
            </div>
        </div>
    );
}

export default Movie;
