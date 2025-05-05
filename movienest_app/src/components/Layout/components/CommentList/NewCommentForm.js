// NewCommentForm.jsx
import React from 'react';
import { Avatar, Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import styles from './CommentList.module.scss';

const { TextArea } = Input;

function NewCommentForm({ userId, newCommentText, setNewCommentText, handleNewComment, isLoading }) {
    return (
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
            >
                Gửi
            </Button>
        </div>
    );
}

export default NewCommentForm;