import classNames from "classnames/bind";
import styles from './DashboardLayout.module.scss';
import Sidebar from '../components/Sidebar'
import Header from "../Header";

const cx = classNames.bind(styles)

function DashboardLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Sidebar />
            <div className={cx('right-container')}>
                <Header />
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

export default DashboardLayout;
