import { Card, Row, Col, Button, Tooltip } from 'antd';
import styles from './MyCollection.module.scss';
import classNames from 'classnames/bind';
import { CrownOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useAuth } from '~/routes/AuthContext';
import { findCollectedMoviesByUserId } from '~/service/user/user';

const cx = classNames.bind(styles);

function MyCollection() {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const currentUserId = user?.userId;
    const [collectionData, setCollectionData] = useState([]);

    const handleCallCollection = async () => {
        console.log('userid: ', currentUserId);
        const data = await findCollectedMoviesByUserId(currentUserId);
        console.log('Collection data: ', data);
        setCollectionData(data);
    }

    useEffect(() => {
        handleCallCollection();
    }, [])

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
                                    <img alt={item.movieTitle} src={item.posterPath} />
                                    {item.isVip = true && (
                                        <span className={cx('vip-badge')}>
                                            <CrownOutlined /> VIP
                                        </span>
                                    )}
                                    <div className={cx('episode-badge')}>
                                        {item.voteAverage}
                                    </div>
                                </div>
                            }
                            className={cx('collection-card')}
                        >
                            <Card.Meta title={item.movieTitle} />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default MyCollection;
