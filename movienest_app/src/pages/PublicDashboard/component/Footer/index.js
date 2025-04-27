import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import {
    FacebookOutlined,
    TwitterOutlined,
    InstagramOutlined,
    YoutubeOutlined,
    ArrowUpOutlined,
} from '@ant-design/icons';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

const { Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const AppFooter = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <Footer className={cx('footer')}>
            <div className={cx('footer-content')}>
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <div className={cx('footer-logo')}>
                            <div className={cx('logo-text')}>
                                <Title level={3} className={cx('site-name')}>
                                    MovieNest<sup>+</sup>
                                </Title>
                                <Text className={cx('tagline')}>
                                    MovieNest and Chill
                                </Text>
                            </div>
                        </div>
                        <Paragraph className={cx('footer-description')}>
                            MovieNest - Trang xem phim Online với giao diện mới
                            được bổ trí và thiết kế thân thiện với người dùng.
                            Nguồn phim được tổng hợp từ các website lớn với đa
                            dạng các đầu phim và thể loại vô cùng phong phú (Trang web phục vụ mục đích học tập).
                        </Paragraph>
                        <Text className={cx('copyright')}>
                            © 2025 by MovieNest
                        </Text>
                    </Col>

                    <Col xs={24} sm={12} md={5} lg={5} xl={5}>
                        <Title level={4} className={cx('column-title')}>
                            Phim mới
                        </Title>
                        <ul className={cx('footer-links')}>
                            <li>
                                <Link to="/phim-khoa-hoc">Phim Khoa Học</Link>
                            </li>
                            <li>
                                <Link to="/phim-kinh-di">Phim Kinh Dị</Link>
                            </li>
                            <li>
                                <Link to="/phim-chieu-rap">Phim Chiếu Rạp</Link>
                            </li>
                            <li>
                                <Link to="/phim-hinh-su">Phim Hình Sự</Link>
                            </li>
                            <li>
                                <Link to="/phim-hanh-dong">Phim Hành Động</Link>
                            </li>
                        </ul>
                    </Col>

                    <Col xs={24} sm={12} md={5} lg={5} xl={5}>
                        <Title level={4} className={cx('column-title')}>
                            Phim hay
                        </Title>
                        <ul className={cx('footer-links')}>
                            <li>
                                <Link to="/phim-au-my">Phim Âu Mỹ</Link>
                            </li>
                            <li>
                                <Link to="/phim-han-quoc">Phim Hàn Quốc</Link>
                            </li>
                            <li>
                                <Link to="/phim-trung-quoc">
                                    Phim Trung Quốc
                                </Link>
                            </li>
                            <li>
                                <Link to="/phim-nhat-ban">Phim Nhật Bản</Link>
                            </li>
                            <li>
                                <Link to="/phim-thai-lan">Phim Thái Lan</Link>
                            </li>
                        </ul>
                    </Col>

                    <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                        <Title level={4} className={cx('column-title')}>
                            Thông tin
                        </Title>
                        <ul className={cx('footer-links')}>
                            <li>
                                <Link to="/gioi-thieu">Giới thiệu</Link>
                            </li>
                            <li>
                                <Link to="/lien-he">Liên hệ chúng tôi</Link>
                            </li>
                            <li>
                                <Link to="/dieu-khoan">Điều khoản sử dụng</Link>
                            </li>
                            <li>
                                <Link to="/chinh-sach">
                                    Chính sách riêng tư
                                </Link>
                            </li>
                            <li>
                                <Link to="/khieu-nai">Khiếu nại bản quyền</Link>
                            </li>
                        </ul>
                    </Col>
                </Row>

                <Divider className={cx('footer-divider')} />

                <div className={cx('footer-bottom')}>
                    <Space className={cx('social-icons')}>
                        <Link
                            to="https://www.facebook.com/vo.hung.261930"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FacebookOutlined className={cx('social-icon')} />
                        </Link>
                        <Link
                            to="https://www.facebook.com/vo.hung.261930"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <TwitterOutlined className={cx('social-icon')} />
                        </Link>
                        <Link
                            to="https://www.facebook.com/vo.hung.261930"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <InstagramOutlined className={cx('social-icon')} />
                        </Link>
                        <Link
                            to="https://www.facebook.com/vo.hung.261930"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <YoutubeOutlined className={cx('social-icon')} />
                        </Link>
                    </Space>

                    <div className={cx('scroll-to-top')} onClick={scrollToTop}>
                        <ArrowUpOutlined />
                    </div>
                </div>
            </div>
        </Footer>
    );
};

export default AppFooter;
