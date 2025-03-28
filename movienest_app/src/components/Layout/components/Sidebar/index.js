import classNames from 'classnames/bind';
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
} from '@ant-design/icons';
import styles from './Sidebar.module.scss';
import logo from '../../../../assets/images/logo.png';
import NavItem from '../NavItem';

const cx = classNames.bind(styles);

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
        title: 'Compose',
        color: '#7b53c0',
        icon: <EditOutlined />
    },
    {
        title: 'Calendar',
        color: '#e91e63',
        icon: <CalendarOutlined />
    },
    {
        title: 'Charts',
        color: '#01a9f4',
        icon: <PieChartOutlined />
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

function Sidebar() {
    

    return (
        <div className={cx('side-bar')}>
            <div className={cx('sidebar-inner')}>
                <div className={cx('sidebar-logo')}>
                    <div className={cx('logo')}>
                        <img src={logo} alt="logo" />
                    </div>
                    <div className={cx('logo-text')}>Adminator</div>
                </div>

                <div className={cx('sidebar-menu')}>
                    {sideBar.map((item, index) => (
                        <NavItem
                            key={index}
                            title={item.title}
                            color={item.color}
                            icon={item.icon}
                            children={item.children}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
