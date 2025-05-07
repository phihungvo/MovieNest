import { Switch, List, Radio } from 'antd';
import styles from './NotificationSettings.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function NotificationSettings() {
    const notificationTypes = [
        {
            title: 'Cập nhật phim mới',
            description: 'Nhận thông báo khi có phim mới được thêm vào',
            key: 'newMovies'
        },
        {
            title: 'Bình luận',
            description: 'Nhận thông báo khi có người trả lời bình luận của bạn',
            key: 'comments'
        },
        {
            title: 'Phim đang theo dõi',
            description: 'Nhận thông báo khi có tập mới của phim bạn đang theo dõi',
            key: 'following'
        }
    ];

    return (
        <div className={cx('notification-settings')}>
            <h2>Cài đặt thông báo</h2>
            
            <div className={cx('section')}>
                <div className={cx('notification-method')}>
                    <h3>Phương thức nhận thông báo</h3>
                    <Radio.Group defaultValue="all">
                        <Radio value="all">Tất cả</Radio>
                        <Radio value="email">Chỉ Email</Radio>
                        <Radio value="push">Chỉ Push notification</Radio>
                        <Radio value="none">Tắt thông báo</Radio>
                    </Radio.Group>
                </div>

                <List
                    className={cx('notification-list')}
                    itemLayout="horizontal"
                    dataSource={notificationTypes}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.title}
                                description={item.description}
                            />
                            <Switch defaultChecked />
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
}

export default NotificationSettings;
