import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './UserInfoManagement.module.scss';
import Header from '../component/Header';
import { UserOutlined, HistoryOutlined, HeartOutlined, LockOutlined, NotificationOutlined } from '@ant-design/icons';
import PersonalInfo from '~/pages/PublicDashboard/UserInfoManagement/sections/PersonalInfo';
import WatchHistory from '~/pages/PublicDashboard/UserInfoManagement/sections/WatchHistory';
import MyCollection from '~/pages/PublicDashboard/UserInfoManagement/sections/MyCollection';
import { useNavigate, useLocation, Outlet, Navigate } from 'react-router-dom';
import SecuritySettings from './sections/SecuritySettings';
import NotificationSettings from './sections/NotificationSettings';
import NavigationPanel from '~/components/Layout/components/NavigationPanel/NavigationPanel';

const cx = classNames.bind(styles);

function UserInfoManagement() {
    const [activeKey, setActiveKey] = useState('personal');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Redirect to personal by default if at root path
        if (location.pathname === '/user-info-management') {
            navigate('/user-info-management/personal');
        }
        const path = location.pathname.split('/').pop();
        setActiveKey(path || 'personal');
    }, [location, navigate]);

    const sideBarItems = [
        {
            title: 'Thông tin cá nhân',
            icon: <UserOutlined />,
            key: 'personal',
            url: '/user-info-management/personal'
        },
        {
            title: 'Lịch sử xem',
            icon: <HistoryOutlined />,
            key: 'history',
            url: '/user-info-management/history'
        },
        {
            title: 'Bộ sưu tập',
            icon: <HeartOutlined />,
            key: 'collection',
            url: '/user-info-management/collection'
        },
        {
            title: 'Bảo mật',
            icon: <LockOutlined />,
            key: 'security',
            url: '/user-info-management/security'
        },
        {
            title: 'Thông báo',
            icon: <NotificationOutlined />,
            key: 'notifications',
            url: '/user-info-management/notifications'
        }
    ];

    const renderContent = () => {
        const currentPath = location.pathname.split('/').pop() || 'personal';
        
        switch (currentPath) {
            case 'personal':
                return <PersonalInfo />;
            case 'history':
                return <WatchHistory />;
            case 'collection':
                return <MyCollection />;
            case 'security':
                return <SecuritySettings />;
            case 'notifications':
                return <NotificationSettings />;
            default:
                return <PersonalInfo />;
        }
    };

    const handleMenuClick = (key, url) => {
        setActiveKey(key);
        navigate(url);
    };

    return (
        <div className={cx('wrapper')}>
            <NavigationPanel 
                hiddenLogo={false} 
                dataSource={sideBarItems}
                onItemClick={(key) => handleMenuClick(key, sideBarItems.find(item => item.key === key)?.url)}
                selectedKey={activeKey}
            />
            <div className={cx('right-container')}>
                <Header activeSearch={false} />
                <div className={cx('content')}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default UserInfoManagement;