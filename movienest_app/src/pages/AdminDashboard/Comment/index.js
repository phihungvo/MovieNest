import React, { useEffect, useState } from 'react';
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
import { Form, message } from 'antd';
import { getAllComments, createComment } from '~/service/comment';
import SmartButton from '~/components/Layout/components/SmartButton';
import SmartTable from '~/components/Layout/components/SmartTable';
import SmartInput from '~/components/Layout/components/SmartInput';
import PopupModal from '~/components/Layout/components/PopupModal';

const cx = (className) => styles[className];

function Comment() {
    const [commentSources, setCommentSources] = useState([]);
    const [modalMode, setModalMode] = useState(null); // 'create', 'edit' or 'delete'
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [selectedComment, setSelectedComment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Movie Name',
            dataIndex: 'movieName',
            key: 'movieName',
            width: 200,
            fixed: 'left',
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            width: 200,
        },
        {
            title: 'User',
            dataIndex: 'username',
            key: 'username',
            width: 150,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 200,
        },
        {
            title: 'Edited',
            dataIndex: 'isEdited',
            key: 'isEdited',
            width: 100,
            render: (official) => (official ? 'YES' : 'NO'),
        },
        {
            title: 'Create At',
            dataIndex: 'createAt',
            key: 'createAt',
            width: 200,
            render: (date) =>
                date ? new Date(date).toLocaleString('vi-VN') : 'N/A',
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
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

    const commentModalFields = [
        {
            label: 'Content',
            name: 'content',
            type: 'text',
        },
        {
            label: 'User',
            name: 'userId',
            type: 'text',
        },
        {
            label: 'Movie',
            name: 'movieId',
            type: 'text',
        },
    ];

    const handleAddComment = () => {
        setModalMode('create');
        setSelectedComment(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleCallCreateComment = async (formData) => {
        console.log('Form data submitted:', formData);
        await createComment(formData);
        handleGetAllComments();
        setIsModalOpen(false);
    };

    const handleGetAllComments = async (page = 0, pageSize = 5) => {
        const response = await getAllComments({ page, pageSize });

        const commentList = response.content;

        if (Array.isArray(commentList)) {
            setCommentSources(commentList);
            setPagination((prev) => ({
                ...prev,
                current: page + 1,
                pageSize: pageSize,
                total: response.totalElements,
            }));
        }
    };

    const handleTableChange = (pagination) => {
        handleGetAllComments(pagination.current, pagination.pageSize);
    };

    useEffect(() => {
        handleGetAllComments();
    }, []);

    const getModalModeTitle = () => {
        switch (modalMode) {
            case 'create':
                return 'Add New Comment';
            case 'edit':
                return 'Edit Comment';
            case 'delete':
                return 'Delete Comment';
            default:
                return 'Comment Details';
        }
    };

    const handleFormSubmit = (formData) => {
        if (modalMode === 'create') {
            handleCallCreateComment(formData);
        }
    };

    return (
        <div className={cx('comment-wrapper')}>
            <div className={cx('card-header')}>
                <h1>Comment Management</h1>
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
                    <SmartButton
                        title="Add new"
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={handleAddComment}
                    />
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
                    onTableChange={handleTableChange}
                />
            </div>

            <PopupModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                title={getModalModeTitle()}
                fields={modalMode === 'delete' ? [] : commentModalFields}
                onSubmit={handleFormSubmit}
                initialValues={selectedComment}
                isDeleteMode={modalMode === 'delete'}
                formInstance={form}
            />
        </div>
    );
}

export default Comment;
