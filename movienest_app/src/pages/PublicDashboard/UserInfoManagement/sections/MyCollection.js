import { Card, Row, Col, Button, Tooltip } from 'antd';
import styles from './MyCollection.module.scss';
import classNames from 'classnames/bind';
import {
    CrownOutlined,
    HeartOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';

const cx = classNames.bind(styles);

function MyCollection() {
    const [loading, setLoading] = useState(false);

    const collectionData = [
        {
            id: 1,
            title: 'Tình Yêu Giả Tạo',
            imageUrl:
                'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
            episode: 'Tập 8',
            isVip: true,
        },
        {
            id: 2,
            title: 'Thế Giới Hoàn Mỹ',
            imageUrl:
                'https://image.tmdb.org/t/p/w500/A1yymig7S0FTWv9cTtOwdI1cH5V.jpg',
            episode: 'Tập 138',
            isVip: true,
        },
        {
            id: 3,
            title: 'Chàng Hậu',
            imageUrl:
                'https://image.tmdb.org/t/p/w500/kuf6dutpsT0vSVehic3EZIqkOBt.jpg',
            episode: 'Tập 16',
            isVip: true,
        },
        {
            id: 4,
            title: 'Thanh Gươm Diệt Quỷ',
            imageUrl:
                'https://image.tmdb.org/t/p/w500/nTvM4mhqNlHIvUkI1gVnW6XP7GG.jpg',
            episode: 'Tập 45',
            isVip: false,
        },
        {
            id: 5,
            title: 'One Piece',
            imageUrl:
                'https://image.tmdb.org/t/p/w500/e3NBGiAifW9Xt8xD5tpARskjccO.jpg',
            episode: 'Tập 1089',
            isVip: true,
        },
        {
            id: 6,
            title: 'Bleach',
            imageUrl:
                'https://image.tmdb.org/t/p/w500/2EewmxXe72ogD0EaWM8gqa0ccIw.jpg',
            episode: 'Tập 366',
            isVip: true,
        },
        {
            id: 7,
            title: 'Jujutsu Kaisen',
            imageUrl:
                'https://image.tmdb.org/t/p/w500/hFWP5HkbVEe40hrXgtCeQxoccHE.jpg',
            episode: 'Tập 23',
            isVip: false,
        },
        {
            id: 8,
            title: 'Attack on Titan',
            imageUrl:
                'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg',
            episode: 'Tập 88',
            isVip: true,
        },
        {
            id: 9,
            title: 'Spy x Family',
            imageUrl:
                'https://image.tmdb.org/t/p/w500/3r4LYFuXrg3G8fepysr4xSLWnQL.jpg',
            episode: 'Tập 25',
            isVip: false,
        },
        {
            id: 10,
            title: 'My Hero Academia',
            imageUrl:
                'https://image.tmdb.org/t/p/w500/ivOLM47yJt90P19RH1NvJrAJz9F.jpg',
            episode: 'Tập 138',
            isVip: true,
        },
        {
            id: 11,
            title: 'Attack on Titan',
            imageUrl:
                'https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg',
            episode: 'Tập 87',
            isVip: true,
        },

        {
            id: 13,
            title: 'Jujutsu Kaisen',
            imageUrl:
                'https://image.tmdb.org/t/p/w500/hFWP5HkbVEe40hrXgtCeQxoccHE.jpg',
            episode: 'Tập 47',
            isVip: true,
        },
        {
            id: 14,
            title: 'One Piece',
            imageUrl:
                'https://image.tmdb.org/t/p/w500/cMD9Ygz11zjJzAovURpO75Qg7rT.jpg',
            episode: 'Tập 1102',
            isVip: false,
        },
        {
            id: 15,
            title: 'Naruto: Shippuden',
            imageUrl:
                'https://image.tmdb.org/t/p/w500/zAYRe2bJxpWTVrwwmBc00VFkAf4.jpg',
            episode: 'Tập 500',
            isVip: true,
        },

        {
            id: 18,
            title: 'Chainsaw Man',
            imageUrl:
                'https://image.tmdb.org/t/p/w500/npdB6eFzizki0WaZ1OvKcJrWe97.jpg',
            episode: 'Tập 12',
            isVip: false,
        },

        {
            id: 20,
            title: 'Bleach: Thousand-Year Blood War',
            imageUrl:
                'https://image.tmdb.org/t/p/w500/1eKWqTHp4OgKdx1QX1O9LxKHr1M.jpg',
            episode: 'Tập 26',
            isVip: false,
        },
    ];

    return (
        <div className={cx('collection-wrapper')}>
            <h2>Bộ sưu tập của tôi</h2>
            <Row gutter={[16, 16]}>
                {collectionData.map((item) => (
                    <Col key={item.id} xs={24} sm={12} md={8} lg={4}>
                        <Card
                            hoverable
                            cover={
                                <div className={cx('image-container')}>
                                    <img alt={item.title} src={item.imageUrl} />
                                    {item.isVip && (
                                        <span className={cx('vip-badge')}>
                                            <CrownOutlined /> VIP
                                        </span>
                                    )}
                                    <div className={cx('episode-badge')}>
                                        {item.episode}
                                    </div>
                                </div>
                            }
                            className={cx('collection-card')}
                        >
                            <Card.Meta title={item.title} />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default MyCollection;
