import classNames from 'classnames/bind';
import styles from './Avatar.module.scss';

const cx = classNames.bind(styles);

function Avatar() {
    return (
        <div className={cx('avatar-wrapper')}>
            <div className={cx('container')}>
                <div className={cx('avatar-container')}>
                    <img src="https://haycafe.vn/wp-content/uploads/2022/10/Hinh-anh-gai-xinh-Viet-Nam-cuoi-tuoi-tan.jpg" alt="Avatar" />
                </div>
                <p className={cx('name')}>John Doe</p>
            </div>
        </div>
    );
}

export default Avatar;
