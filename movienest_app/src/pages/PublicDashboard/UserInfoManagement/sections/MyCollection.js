import { Card, Row, Col } from 'antd';
import styles from './MyCollection.module.scss';
import classNames from 'classnames/bind';
import { CrownOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

function MyCollection() {
    const collectionData = [
        {
            id: 1,
            title: 'Tình Yêu Giả Tạo',
            imageUrl: '/path/to/image.jpg',
            episode: 'Tập 8',
            isVip: true
        },
        {
            id: 2,
            title: 'Hoài Thủy Trúc Định',
            imageUrl: '/path/to/image2.jpg', 
            episode: 'Tập 22',
            isVip: true
        }
    ];

    return (
        <div className={cx('collection-wrapper')}>
            <h2>Bộ sưu tập của tôi</h2>
            <Row gutter={[16, 16]}>
                {collectionData.map(item => (
                    <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
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
                            <Card.Meta 
                                title={item.title}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default MyCollection;
