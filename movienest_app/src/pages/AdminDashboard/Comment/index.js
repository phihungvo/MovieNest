import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Comment.module.scss';
import {
    SearchOutlined,
    PlusOutlined,
    FilterOutlined,
    CloudUploadOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import SmartButton from '~/components/Layout/components/SmartButton';
import SmartTable from '~/components/Layout/components/SmartTable';
import SmartInput from '~/components/Layout/components/SmartInput';

const cx = classNames.bind(styles);

function Comment() {
    const [commentSources, setCommentSources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });

    // String content;

    // Date createAt;

    // Date updatedAt;

    // boolean isEdited;

    // boolean isHidden;

    const columns = [
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
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
        {
            title: 'Movie',
            dataIndex: 'movie',
            key: 'movie',
            width: 100,
            render: (movie) => (movie ? movie.title : 'N/A'),
        },
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
                        // onClick={() => handleEditTrailer(record)}
                    />
                    <SmartButton
                        title="Delete"
                        type="danger"
                        icon={<DeleteOutlined />}
                        buttonWidth={80}
                        // onClick={() => handleDeleteTrailer(record)}
                        style={{ marginLeft: '8px' }}
                    />
                </>
            ),
        },
    ];

    return (
        <div className={cx('comment-wrapper')}>
            <div className={cx('comment-wrapper')}>
                <h2>Comment Management</h2>
                <div>
                    <SmartButton 
                        title='Add new'
                        icon={<PlusOutlined />}
                        type="primary"
                        // onClick={handleAddTrailer}
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

            <div className={cx('comment-contailer')}>
                <SmartTable 
                    columns={columns}
                    dataSources={commentSources}
                    loading={loading}
                    pagination={pagination}
                    // onTableChange={handleTableChange}
                />
            </div>
        </div>
    );
}

export default Comment;
