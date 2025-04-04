import classNames from "classnames/bind";
import styles from './DashboardLayout.module.scss';
import Sidebar from '../components/Sidebar'
import Header from "../Header";
import {
    HomeOutlined,
    MailOutlined,
    EditOutlined,
    CalendarOutlined,
    PieChartOutlined,
    SettingOutlined,
    UserOutlined,
    BellOutlined,
    FileTextOutlined,
    ShopOutlined,
    InboxOutlined,
    SendOutlined,
    CommentOutlined,
} from '@ant-design/icons';

const cx = classNames.bind(styles)

const sideBar = [
    {
        title: 'Dashboard',
        color: '#44a2f5',
        icon: <HomeOutlined />
    },
    {
        title: 'Email',
        color: '#795648',
        icon: <MailOutlined />,
        children: [
            {title: 'Inbox', icon: <InboxOutlined /> },
            { title: 'Sent', icon: <SendOutlined /> },
        ]
    },
    {
        title: 'Movie',
        color: '#7b53c0',
        icon: <EditOutlined />,
        url: '/admin/movie'
    },
    {
        title: 'Trailer',
        color: '#e91e63',
        icon: <CalendarOutlined />,
        url: '/admin/trailer'
    },
    {
        title: 'Comment',
        color: '#01a9f4',
        icon: <CommentOutlined />,
        url: '/admin/comment'
    },
    {
        title: 'Settings',
        color: '#ff9800',
        icon: <SettingOutlined />
    },
    {
        title: 'Profile',
        color: '#9c27b0',
        icon: <UserOutlined />
    },
    {
        title: 'Notifications',
        color: '#f44336',
        icon: <BellOutlined />
    },
    {
        title: 'Documents',
        color: '#4caf50',
        icon: <FileTextOutlined />
    },
    {
        title: 'Store',
        color: '#3f51b5',
        icon: <ShopOutlined />
    },
];

function DashboardLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Sidebar dataSource={sideBar}/>
            <div className={cx('right-container')}>
                <Header />
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

export default DashboardLayout;
