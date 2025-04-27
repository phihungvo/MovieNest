import styles from './HomeDashboard.module.scss';
import React from 'react';
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    LikeOutlined,
} from '@ant-design/icons';
import {
    Col,
    Row,
    Statistic,
    Card,
    Timeline,
    Input,
    QRCode,
    Space,
    Avatar,
    List,
    
} from 'antd';
import {
    ClockCircleOutlined,
    MessageOutlined,
    StarOutlined,
} from '@ant-design/icons';

const { Countdown } = Statistic;
// import classNames from 'classnames/bind';
// import styles from './HomeDashboard.module.scss';

const cx = (classNames) => styles[classNames];

const data = Array.from({ length: 23 }).map((_, i) => ({
    href: 'https://ant.design',
    title: `ant design part ${i}`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
    description:
        'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
}));
const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

function HomeDashboard() {
    const deadline = Date.now() + 6000 * 72 * 43 * 24 * 2 + 1000 * 30;
    const onFinish = () => {
        console.log('finished!');
    };
    const onChange = (val) => {
        if (typeof val === 'number' && 4.95 * 1000 < val && val < 5 * 1000) {
            console.log('changed!');
        }
    };

    const [text, setText] = React.useState('https://ant.design/');

    return (
        <div className={cx('dashboard-wrapper')}>
            <div className={cx('comment-contailer')}>
                <Row gutter={16} style={{ marginBottom: '24px' }}>
                    <Col span={8}>
                        <Card variant="borderless">
                            <Statistic
                                title="Tổng số người dùng"
                                value={11.28}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix="%"
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card variant="borderless">
                            <Statistic
                                title="Lượt xem phim hôm nay"
                                value={9.3}
                                precision={2}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<ArrowDownOutlined />}
                                suffix="%"
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card variant="borderless">
                            <Countdown
                                title="Thời gian còn lại cho sự kiện"
                                value={deadline}
                                onFinish={onFinish}
                            />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginBottom: '24px'}}>
                    <Col span={16}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Card variant="borderless">
                                    <Statistic
                                        title="Feedback"
                                        value={1128}
                                        prefix={<LikeOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card variant="borderless">
                                    <Statistic
                                        title="Unmerged"
                                        value={93}
                                        suffix="/ 100"
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card variant="borderless">
                                    <Statistic
                                        title="Tổng doanh thu"
                                        value={20123.45}
                                        precision={2}
                                        valueStyle={{ color: '#3f8600' }}
                                        prefix="₫"
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card variant="borderless">
                                    <Statistic
                                        title="Đơn hàng thành công"
                                        value={734}
                                        suffix=" giao dịch"
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </Col>

                    {/* Cột bên phải: 2 dòng QRCode */}
                    <Col span={8}>
                        <Row gutter={[0, 16]}>
                            <Col span={24}>
                                <Card variant="borderless">
                                    <Space direction="vertical" align="center">
                                        <QRCode value={text || '-'} />
                                        <div>Mã QR truy cập</div>
                                    </Space>
                                </Card>
                            </Col>
                            {/* <Col span={24}>
                <Card variant="borderless">
                    <Space direction="vertical" align="center">
                        <QRCode value="https://phimmoi.vn" />
                        <div>QR xem phim</div>
                    </Space>
                </Card>
            </Col> */}
                        </Row>
                    </Col>
                </Row>

                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: (page) => {
                            console.log(page);
                        },
                        pageSize: 3,
                    }}
                    dataSource={data}
                    footer={
                        <div>
                            <b>ant design</b> footer part
                        </div>
                    }
                    renderItem={(item) => (
                        <List.Item
                            key={item.title}
                            actions={[
                                <IconText
                                    icon={StarOutlined}
                                    text="156"
                                    key="list-vertical-star-o"
                                />,
                                <IconText
                                    icon={LikeOutlined}
                                    text="156"
                                    key="list-vertical-like-o"
                                />,
                                <IconText
                                    icon={MessageOutlined}
                                    text="2"
                                    key="list-vertical-message"
                                />,
                            ]}
                            extra={
                                <img
                                    width={272}
                                    alt="logo"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                />
                            }
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar} />}
                                title={<a href={item.href}>{item.title}</a>}
                                description={item.description}
                            />
                            {item.content}
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
}

export default HomeDashboard;
