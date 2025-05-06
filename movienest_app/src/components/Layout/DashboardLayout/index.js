import classNames from 'classnames/bind';
import styles from './DashboardLayout.module.scss';
import Sidebar from '../components/Sidebar';
import Header from '../Header';
import {
    HomeOutlined,
    MailOutlined,
    EditOutlined,
    CalendarOutlined,
    ProfileOutlined,
    UserOutlined,
    BellOutlined,
    FileTextOutlined,
    ShopOutlined,
    InboxOutlined,
    SendOutlined,
    CommentOutlined,
    SettingFilled,
} from '@ant-design/icons';

const cx = classNames.bind(styles);

const sideBar = [
    {
        title: 'Dashboard',
        color: '#1890ff',
        icon: <HomeOutlined />,
        url: '/admin/dashboard',
    },
    {
        title: 'Banner',
        color: '#52c41a',
        icon: <FileTextOutlined />,
        url: '/admin/banner',
    },
    {
        title: 'Movie',
        color: '#722ed1',
        icon: <EditOutlined />,
        url: '/admin/movie',
    },
    {
        title: 'Trailer',
        color: '#eb2f96',
        icon: <CalendarOutlined />,
        url: '/admin/trailer',
    },
    {
        title: 'Actor',
        color: '#13c2c2',
        icon: <UserOutlined />,
        url: '/admin/actor',
    },
    {
        title: 'Comment',
        color: '#fa8c16',
        icon: <CommentOutlined />,
        url: '/admin/comment',
    },
    {
        title: 'User',
        color: '#8c8c8c',
        icon: <ProfileOutlined />,
        url: '/admin/user',
    },
    {
        title: 'Notifications',
        color: '#f5222d',
        icon: <BellOutlined />,
    },
    {
        title: 'Setting',
        color: '#2f54eb',
        icon: <SettingFilled />,
    },
    {
        title: 'Store',
        color: '#faad14',
        icon: <ShopOutlined />,
    },
];

function DashboardLayout({ children, pageTitle }) {
    
    const title = pageTitle || 'Dashboard';

    return (
        <div className={cx('wrapper')}>
            <Sidebar dataSource={sideBar} />
            <div className={cx('right-container')}>
                <Header title={title} />
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

export default DashboardLayout;
