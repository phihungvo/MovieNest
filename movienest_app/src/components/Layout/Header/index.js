import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import Avatar from '../components/Avatar';
import Notification from '../components/Notification';
import { MailOutlined, BellOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

const notificationIcons = [
    {
        icon: <BellOutlined />,
        count: 3,
    },
    {
        icon: <MailOutlined />,
        count: 5,
    },
];

function Header() {
    return (
        <>
            <div className={cx('header-nav')}>
                <div className={cx('header-container')}>
                    <div className={cx('nav-left')}></div>
                    <div className={cx('nav-right')}>
                        {notificationIcons.map((item, index) => (
                            <Notification
                                key={index}
                                icon={item.icon}
                                count={item.count}
                                style={{}}
                            />
                        ))}
                        <Avatar />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;
