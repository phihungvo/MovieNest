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
import { Form, message, Tag } from 'antd';
import {
    getAllComments,
    createComment,
    updateComment,
    deleteComment,
} from '~/service/admin/comment';
import SmartButton from '~/components/Layout/components/SmartButton';
import SmartTable from '~/components/Layout/components/SmartTable';
import SmartInput from '~/components/Layout/components/SmartInput';
import PopupModal from '~/components/Layout/components/PopupModal';

const cx = (className) => styles[className];

function Comment() {
    const [commentSources, setCommentSources] = useState([]);
    const [modalMode, setModalMode] = useState(null);
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
            render: (status) => {
                let color;
                switch (status) {
                    case 'APPROVED':
                        color = 'green';
                        break;
                    case 'PENDING':
                        color = 'orange';
                        break;
                    case 'REJECTED':
                        color = 'red';
                        break;
                    default:
                        color = 'default';
                }
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Edited',
            dataIndex: 'isEdited',
            key: 'isEdited',
            width: 100,
            render: (isEdited) => (isEdited ? 'YES' : 'NO'),
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
                        onClick={() => handleEditComment(record)}
                    />
                    <SmartButton
                        title="Delete"
                        type="danger"
                        icon={<DeleteOutlined />}
                        buttonWidth={80}
                        onClick={() => handleDeleteComment(record)}
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
            label: 'Status',
            name: 'status',
            type: 'select',
            options: ['APPROVED', 'PENDING', 'REJECTED'],
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
        await createComment(formData);
        handleGetAllComments();
        setIsModalOpen(false);
    };

    const handleEditComment = (record) => {
        setSelectedComment(record);
        setModalMode('edit');

        const formData = {
            content: record.content,
            userId: record.userId,
            movieId: record.movieId,
            status: record.status,
        };

        form.setFieldsValue(formData);
        setIsModalOpen(true);
    };

    const handleCallUpdateComment = async (formData) => {
        await updateComment(selectedComment.id, formData);
        message.success('Comment updated successfully!');
        handleGetAllComments();
        setIsModalOpen(false);
    };

    const handleDeleteComment = (record) => {
        setModalMode('delete');
        setSelectedComment(record);
        setIsModalOpen(true);
    };

    const handleCallDeleteComment = async () => {
        await deleteComment(selectedComment.id);
        message.success('Comment deleted successfully!');
        handleGetAllComments();
        setIsModalOpen(false);
    };

    const handleGetAllComments = async (page = 1, pageSize = 5) => {
        const response = await getAllComments({ page: page - 1, pageSize });

        const commentList = response.content;

        if (Array.isArray(commentList)) {
            setCommentSources(commentList);
            setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: pageSize,
                total: response.totalElements,
            }));
        }
    };

    const handleTableChange = (pagination) => {
        handleGetAllComments(pagination.current, pagination.pageSize);
    };

    const handleFormSubmit = (formData) => {
        if (modalMode === 'create') {
            handleCallCreateComment(formData);
        } else if (modalMode === 'edit') {
            handleCallUpdateComment(formData);
        } else if (modalMode === 'delete') {
            handleCallDeleteComment();
        }
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

    return (
        <div className={cx('comment-wrapper')}>
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
