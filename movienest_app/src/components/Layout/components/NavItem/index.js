import classNames from 'classnames/bind';
import styles from './NavItem.module.scss';
import { useState } from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

function NavItem({ title, color, icon, children }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        if (children) setIsOpen(!isOpen);
    };

    return (
        <div className={cx('nav-item')}>
            <div className={cx('sidebar-link')} onClick={handleToggle}>
                <div className={cx('logo-item')} style={{ color: color }}>
                    {icon}
                </div>
                <div className={cx('title')}>
                    <p>{title}</p>
                </div>
                {children && (
                    <div className={cx('arrow')}>
                        {isOpen ? <DownOutlined /> : <RightOutlined />}
                    </div>
                )}
            </div>

            {children && isOpen && (
                <div className={cx('sub-menu')}>
                    {children.map((child, index) => (
                        <div key={index} className={cx('sub-item')}>
                            <span>{child.icon}</span>
                            <span>{child.title}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default NavItem;
