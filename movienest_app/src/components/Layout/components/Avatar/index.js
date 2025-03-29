import classNames from 'classnames/bind';
import styles from './Avatar.module.scss';
import { useNavigate } from 'react-router-dom';
// import {publicRoute} from 

const cx = classNames.bind(styles);

function Avatar() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login'); 
    }

    return (
        <div className={cx('avatar-wrapper')}>
            <div className={cx('container')} onClick={() => handleLogin()}>
                <div className={cx('avatar-container')}>
                    <img src="https://haycafe.vn/wp-content/uploads/2022/10/Hinh-anh-gai-xinh-Viet-Nam-cuoi-tuoi-tan.jpg" alt="Avatar" />
                </div>
                <p className={cx('name')}>John Doe</p>
            </div>
        </div>
    );
}

export default Avatar;
