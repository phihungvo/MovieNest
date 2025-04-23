import classNames from 'classnames/bind';
import styles from './Avatar.module.scss';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/routes/AuthContext';

const cx = classNames.bind(styles);

function Avatar() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className={cx('avatar-wrapper')}>
            <div className={cx('container')} onClick={() => handleLogin()}>
                <div className={cx('avatar-container')}>
                    <img
                        src="https://khoinguonsangtao.vn/wp-content/uploads/2022/09/hinh-anh-gai-xinh-cap-2-3.jpg"
                        alt="Avatar"
                    />
                </div>
                <p className={cx('name')}>
                    {user?.username}
                </p>
            </div>
        </div>
    );
}

export default Avatar;
