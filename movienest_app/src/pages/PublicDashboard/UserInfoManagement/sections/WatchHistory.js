import { List, Avatar, Progress } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import styles from './WatchHistory.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function WatchHistory() {
    const watchHistoryData = [
        {
            id: 1,
            title: 'Người Nhện: Du Hành Vũ Trụ Nhện',
            imageUrl: 'https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg',
            lastWatched: '2024-01-10',
            progress: 75,
            duration: '2h 20m',
            episode: 'Tập 1'
        },
        {
            id: 2,
            title: 'Oppenheimer',
            imageUrl: 'https://image.tmdb.org/t/p/w500/9PqD3wSIjntyJDBzMNuxuKHwpUD.jpg',
            lastWatched: '2024-01-09',
            progress: 30,
            duration: '3h 00m',
            episode: 'Tập 1'
        },
        {
            id: 2,
            title: 'Oppenheimer',
            imageUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
            lastWatched: '2024-01-09',
            progress: 65,
            duration: '3h 00m',
            episode: 'Tập 1'
        }
    ];

    return (
        <div className={cx('watch-history')}>
            <h2>Lịch sử xem</h2>
            <List
                itemLayout="horizontal"
                dataSource={watchHistoryData}
                renderItem={(item) => (
                    <List.Item className={cx('history-item')}>
                        <div className={cx('movie-poster')}>
                            <img src={item.imageUrl} alt={item.title} />
                            <div className={cx('play-overlay')}>
                                <PlayCircleOutlined />
                            </div>
                        </div>
                        <div className={cx('movie-info')}>
                            <h3>{item.title}</h3>
                            <p className={cx('episode')}>{item.episode}</p>
                            <div className={cx('progress-section')}>
                                <Progress 
                                    percent={item.progress} 
                                    size="small" 
                                    showInfo={false}
                                    strokeColor="#1890ff"
                                    trailColor="#404040"
                                />
                                <span className={cx('duration')}>
                                    {item.duration}
                                </span>
                            </div>
                            <p className={cx('last-watched')}>
                                Xem gần đây: {new Date(item.lastWatched).toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
}

export default WatchHistory;
