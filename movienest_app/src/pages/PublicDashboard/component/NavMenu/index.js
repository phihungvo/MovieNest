import classNames from "classnames/bind";
import styles from './NavMenu.module.scss';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function NavMenu({publicRoutes}) {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        if (path === '/') {
            navigate('/');
        } else {
            navigate(path);
        }
    };

    return (
        <div className={cx('wrapper')}>
            {publicRoutes.slice(0, publicRoutes.length).map((route, index) => (
                <div
                    className={cx('menu_item')}
                    onClick={() => handleNavigate(route.path)}
                    key={index}
                >
                    {route.title}
                </div>
            ))}
        </div>
    );
}

export default NavMenu;
