import React, { useState, useEffect } from 'react';
import {
    Avatar,
    List,
    Typography,
    Pagination,
    Input,
    Button,
    Space,
    Divider,
    Modal,
    message,
    Dropdown,
} from 'antd';
import {
    CommentOutlined,
    LikeOutlined,
    DislikeOutlined,
    SendOutlined,
    EditOutlined,
    DeleteOutlined,
    MoreOutlined,
} from '@ant-design/icons';
import styles from './CommentList.module.scss';
import axios from 'axios';
import { getToken } from '~/constants/token';
import {
    createComment,
    getAllComments,
    updateCommentForUser,
    updateComment,
    deleteComment,
    reactionToAComment,
} from '~/service/admin/comment';
import API_ENDPOINTS from '~/constants/endpoints';
const { TextArea } = Input;


function CommentList({ movieId, userId }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [expandedComments, setExpandedComments] = useState({});
    const [replyText, setReplyText] = useState({});
    const [allComments, setAllComments] = useState([]);
    const [totalComments, setTotalComments] = useState(0);
    const [newCommentText, setNewCommentText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [currentUsername, setCurrentUsername] = useState('');

    const fetchComments = async () => {
        setIsLoading(true);
        try {
            const data = await getAllComments({ page: currentPage, pageSize });
            setAllComments(data.content || []);
            setTotalComments(data.totalElements || 0);
        } catch (error) {
            message.error('Không thể tải bình luận');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {

        // const fetchUserInfo = async () => {
        //     try {
        //         const userInfo = await getUserInfo(userId);
        //         setCurrentUsername(userInfo.username);
        //     } catch (error) {
        //         console.error("Không thể lấy thông tin người dùng");
        //     }
        // };

        // fetchUserInfo();
        fetchComments();
        // reactionToAComment(commentId);
    }, [currentPage, pageSize]);

    const formatDateTime = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return 'Vài giây trước';
        } else if (diffInSeconds < 3600) {
            return `${Math.floor(diffInSeconds / 60)} phút trước`;
        } else if (diffInSeconds < 86400) {
            return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
        } else {
            return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
        }
    };

    const toggleReply = (commentId) => {
        setExpandedComments((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));

        if (!replyText[commentId]) {
            setReplyText((prev) => ({
                ...prev,
                [commentId]: '',
            }));
        }
    };

    const handleNewComment = async () => {
        if (!newCommentText.trim()) return;

        try {
            const newCommentData = {
                content: newCommentText,
                movieId: movieId,
                userId: userId,
            };

            await createComment(newCommentData);
            message.success('Bình luận đã được gửi thành công');
            setNewCommentText('');
            fetchComments();
        } catch (error) {
            message.error('Không thể gửi bình luận');
        }
    };

    const handleReply = async (commentId) => {
        if (!replyText[commentId]?.trim()) return;

        try {
            const replyData = {
                content: replyText[commentId],
                movieId: movieId,
                userId: userId,
            };

            await axios.post(
                // `${API_ENDPOINTS.COMMENTS.REPLY_TO_A_COMMENT(commentId)}`,

                `${API_ENDPOINTS.COMMENTS.BASE_URL}/${commentId}/reply`,
                replyData,
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            // Reset input reply
            setReplyText((prev) => ({
                ...prev,
                [commentId]: '',
            }));

            message.success('Phản hồi đã được gửi thành công');
            fetchComments();
        } catch (error) {
            message.error('Không thể gửi phản hồi');
        }
    };

    const handleLikeComment = async (commentId) => {
        try {
            await updateCommentForUser(commentId, { action: 'LIKE' });
            fetchComments();
        } catch (error) {
            message.error('Không thể thích bình luận');
        }
    };

    const handleDislikeComment = async (commentId) => {
        try {
            await updateCommentForUser(commentId, { action: 'DISLIKE' });
            fetchComments();
        } catch (error) {
            message.error('Không thể bày tỏ không thích bình luận');
        }
    };

    const startEditComment = (comment) => {
        setEditingComment(comment.id);
        setEditText(comment.content);
    };

    const saveEditComment = async () => {
        if (!editText.trim()) return;

        try {
            await updateComment(editingComment, { content: editText });
            setEditingComment(null);
            message.success('Bình luận đã được cập nhật');
            fetchComments();
        } catch (error) {
            message.error('Không thể cập nhật bình luận');
        }
    };

    const cancelEditComment = () => {
        setEditingComment(null);
        setEditText('');
    };

    const showDeleteConfirm = (commentId) => {
        setCommentToDelete(commentId);
        setIsModalVisible(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteComment(commentToDelete);
            setIsModalVisible(false);
            message.success('Bình luận đã được xóa');
            fetchComments();
        } catch (error) {
            message.error('Không thể xóa bình luận');
        }
    };

    const cancelDelete = () => {
        setIsModalVisible(false);
        setCommentToDelete(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page - 1);
    };

    const handlePageSizeChange = (current, size) => {
        setPageSize(size);
        setCurrentPage(0); // Khi thay đổi kích thước trang, quay về trang đầu tiên
    };

    const isCommentOwner = (comment) => {
        console.log("Comment data:", comment);
        console.log('compare: ', comment.userId, ' and userId ', userId);
        return comment.userId === userId;
    };

    // Menu cho từng comment
    const getCommentMenu = (comment) => {
        const items = [];

        if (isCommentOwner(comment)) {
            items.push(
                {
                    key: 'edit',
                    label: 'Chỉnh sửa',
                    icon: <EditOutlined />,
                    onClick: () => startEditComment(comment),
                },
                {
                    key: 'delete',
                    label: 'Xóa',
                    icon: <DeleteOutlined />,
                    onClick: () => showDeleteConfirm(comment.id),
                },
            );
        }

        return { items };
    };

    return (
        <div className={styles['comment-container']}>
            {/* Add new comment section */}
            <div className={styles['new-comment']}>
                <Avatar src={`https://i.pravatar.cc/150?u=${userId}`} />
                <TextArea
                    placeholder="Viết bình luận của bạn..."
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    className={styles['comment-input']}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                />
                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    className={styles['submit-button']}
                    onClick={handleNewComment}
                    loading={isLoading}
                >
                    Gửi
                </Button>
            </div>

            <Divider className={styles['divider']} />

            {/* Comments list */}
            <List
                className={styles['comment-list']}
                itemLayout="vertical"
                loading={isLoading}
                dataSource={allComments}
                renderItem={(item) => (
                    <List.Item className={styles['comment-item']}>
                        <div className={styles['comment-header']}>
                            <Avatar
                                src={`https://i.pravatar.cc/150?u=${item.username}`}
                                className={styles['avatar']}
                            />
                            <div className={styles['comment-info']}>
                                <Typography.Text
                                    strong
                                    className={styles['author']}
                                >
                                    {item.username}
                                </Typography.Text>
                                <Typography.Text className={styles['datetime']}>
                                    {formatDateTime(item.createAt)}
                                </Typography.Text>
                            </div>

                            {/* Comment actions dropdown */}
                            {isCommentOwner(item) && (
                                <Dropdown
                                    menu={getCommentMenu(item)}
                                    placement="bottomRight"
                                    trigger={['click']}
                                >
                                    <Button
                                        type="text"
                                        icon={<MoreOutlined />}
                                        className={styles['more-actions']}
                                    />
                                </Dropdown>
                            )}
                        </div>

                        <div className={styles['comment-content']}>
                            {editingComment === item.id ? (
                                <div className={styles['edit-container']}>
                                    <TextArea
                                        value={editText}
                                        onChange={(e) =>
                                            setEditText(e.target.value)
                                        }
                                        autoSize={{ minRows: 2, maxRows: 4 }}
                                        className={styles['edit-input']}
                                    />
                                    <div className={styles['edit-actions']}>
                                        <Button
                                            size="small"
                                            onClick={cancelEditComment}
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            type="primary"
                                            size="small"
                                            onClick={saveEditComment}
                                        >
                                            Lưu
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                item.content
                            )}
                        </div>

                        <div className={styles['comment-actions']}>
                            <Space>
                                <Button
                                    type="text"
                                    icon={<LikeOutlined />}
                                    className={styles['action-button']}
                                    onClick={() => handleLikeComment(item.id)}
                                >
                                    {item.likeCount}
                                </Button>
                                <Button
                                    type="text"
                                    icon={<DislikeOutlined />}
                                    className={styles['action-button']}
                                    onClick={() =>
                                        handleDislikeComment(item.id)
                                    }
                                >
                                    {item.dislikeCount}
                                </Button>
                                <Button
                                    type="text"
                                    icon={<CommentOutlined />}
                                    onClick={() => toggleReply(item.id)}
                                    className={styles['action-button']}
                                >
                                    Trả lời
                                </Button>
                            </Space>
                        </div>

                        {/* Replies section */}
                        {item.replies && item.replies.length > 0 && (
                            <div className={styles['replies-section']}>
                                <List
                                    itemLayout="vertical"
                                    dataSource={item.replies}
                                    renderItem={(reply) => (
                                        <List.Item
                                            className={styles['reply-item']}
                                        >
                                            <div
                                                className={
                                                    styles['comment-header']
                                                }
                                            >
                                                <Avatar
                                                    src={`https://i.pravatar.cc/150?u=${reply.username}`}
                                                    size="small"
                                                    className={styles['avatar']}
                                                />
                                                <div
                                                    className={
                                                        styles['comment-info']
                                                    }
                                                >
                                                    <Typography.Text
                                                        strong
                                                        className={
                                                            styles['author']
                                                        }
                                                    >
                                                        {reply.username}
                                                    </Typography.Text>
                                                    <Typography.Text
                                                        className={
                                                            styles['datetime']
                                                        }
                                                    >
                                                        {formatDateTime(
                                                            reply.createAt,
                                                        )}
                                                    </Typography.Text>
                                                </div>

                                                {/* Reply actions dropdown */}
                                                {isCommentOwner(reply) && (
                                                    <Dropdown
                                                        menu={getCommentMenu(
                                                            reply,
                                                        )}
                                                        placement="bottomRight"
                                                        trigger={['click']}
                                                    >
                                                        <Button
                                                            type="text"
                                                            icon={
                                                                <MoreOutlined />
                                                            }
                                                            className={
                                                                styles[
                                                                    'more-actions'
                                                                ]
                                                            }
                                                        />
                                                    </Dropdown>
                                                )}
                                            </div>

                                            <div
                                                className={
                                                    styles['reply-content']
                                                }
                                            >
                                                {editingComment === reply.id ? (
                                                    <div
                                                        className={
                                                            styles[
                                                                'edit-container'
                                                            ]
                                                        }
                                                    >
                                                        <TextArea
                                                            value={editText}
                                                            onChange={(e) =>
                                                                setEditText(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            autoSize={{
                                                                minRows: 2,
                                                                maxRows: 4,
                                                            }}
                                                            className={
                                                                styles[
                                                                    'edit-input'
                                                                ]
                                                            }
                                                        />
                                                        <div
                                                            className={
                                                                styles[
                                                                    'edit-actions'
                                                                ]
                                                            }
                                                        >
                                                            <Button
                                                                size="small"
                                                                onClick={
                                                                    cancelEditComment
                                                                }
                                                            >
                                                                Hủy
                                                            </Button>
                                                            <Button
                                                                type="primary"
                                                                size="small"
                                                                onClick={
                                                                    saveEditComment
                                                                }
                                                            >
                                                                Lưu
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    reply.content
                                                )}
                                            </div>

                                            <div
                                                className={
                                                    styles['comment-actions']
                                                }
                                            >
                                                <Space>
                                                    <Button
                                                        type="text"
                                                        icon={<LikeOutlined />}
                                                        size="small"
                                                        className={
                                                            styles[
                                                                'action-button'
                                                            ]
                                                        }
                                                        onClick={() =>
                                                            handleLikeComment(
                                                                reply.id,
                                                            )
                                                        }
                                                    >
                                                        {reply.likeCount}
                                                    </Button>
                                                    <Button
                                                        type="text"
                                                        icon={
                                                            <DislikeOutlined />
                                                        }
                                                        size="small"
                                                        className={
                                                            styles[
                                                                'action-button'
                                                            ]
                                                        }
                                                        onClick={() =>
                                                            handleDislikeComment(
                                                                reply.id,
                                                            )
                                                        }
                                                    >
                                                        {reply.dislikeCount}
                                                    </Button>
                                                </Space>
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            </div>
                        )}

                        {/* Reply input */}
                        {expandedComments[item.id] && (
                            <div className={styles['reply-input-container']}>
                                <Avatar
                                    src={`https://i.pravatar.cc/150?u=${userId}`}
                                    size="small"
                                />
                                <TextArea
                                    placeholder="Viết trả lời của bạn..."
                                    autoSize={{ minRows: 1, maxRows: 3 }}
                                    value={replyText[item.id] || ''}
                                    onChange={(e) =>
                                        setReplyText((prev) => ({
                                            ...prev,
                                            [item.id]: e.target.value,
                                        }))
                                    }
                                    className={styles['reply-input']}
                                />
                                <Button
                                    type="primary"
                                    size="small"
                                    icon={<SendOutlined />}
                                    onClick={() => handleReply(item.id)}
                                    className={styles['reply-button']}
                                >
                                    Gửi
                                </Button>
                            </div>
                        )}
                    </List.Item>
                )}
            />

            {/* Pagination */}
            {totalComments > 0 && (
                <div className={styles['pagination-container']}>
                    <Pagination
                        current={currentPage + 1} // UI hiển thị từ trang 1, API bắt đầu từ trang 0
                        pageSize={pageSize}
                        total={totalComments}
                        onChange={handlePageChange}
                        onShowSizeChange={handlePageSizeChange}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20']}
                        className={styles['pagination']}
                    />
                </div>
            )}

            {/* Modal xác nhận xóa */}
            <Modal
                title="Xác nhận xóa"
                open={isModalVisible}
                onOk={confirmDelete}
                onCancel={cancelDelete}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa bình luận này không?</p>
            </Modal>
        </div>
    );
}

export default CommentList;
