import React, { useState, useEffect } from 'react';
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
import { useLanguage } from '~/contexts/LanguageContext';

const cx = classNames.bind(styles);

const { Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const AppFooter = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { translate } = useLanguage();

    // Check scroll position
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

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
                                    {translate('footer.tagline')}
                                </Text>
                            </div>
                        </div>
                        <Paragraph className={cx('footer-description')}>
                            {translate('footer.description')}
                        </Paragraph>
                        <Text className={cx('copyright')}>
                            {translate('footer.copyright')}
                        </Text>
                    </Col>

                    <Col xs={24} sm={12} md={5} lg={5} xl={5}>
                        <Title level={4} className={cx('column-title')}>
                            {translate('footer.newMovies')}
                        </Title>
                        <ul className={cx('footer-links')}>
                            <li>
                                <Link to="/phim-khoa-hoc">{translate('footer.movieCategories.science')}</Link>
                            </li>
                            <li>
                                <Link to="/phim-kinh-di">{translate('footer.movieCategories.horror')}</Link>
                            </li>
                            <li>
                                <Link to="/phim-chieu-rap">{translate('footer.movieCategories.theater')}</Link>
                            </li>
                            <li>
                                <Link to="/phim-hinh-su">{translate('footer.movieCategories.crime')}</Link>
                            </li>
                            <li>
                                <Link to="/phim-hanh-dong">{translate('footer.movieCategories.action')}</Link>
                            </li>
                        </ul>
                    </Col>

                    <Col xs={24} sm={12} md={5} lg={5} xl={5}>
                        <Title level={4} className={cx('column-title')}>
                            {translate('footer.popularMovies')}
                        </Title>
                        <ul className={cx('footer-links')}>
                            <li>
                                <Link to="/phim-au-my">{translate('footer.regions.hollywood')}</Link>
                            </li>
                            <li>
                                <Link to="/phim-han-quoc">{translate('footer.regions.korean')}</Link>
                            </li>
                            <li>
                                <Link to="/phim-trung-quoc">{translate('footer.regions.chinese')}</Link>
                            </li>
                            <li>
                                <Link to="/phim-nhat-ban">{translate('footer.regions.japanese')}</Link>
                            </li>
                            <li>
                                <Link to="/phim-thai-lan">{translate('footer.regions.thai')}</Link>
                            </li>
                        </ul>
                    </Col>

                    <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                        <Title level={4} className={cx('column-title')}>
                            {translate('footer.information')}
                        </Title>
                        <ul className={cx('footer-links')}>
                            <li>
                                <Link to="/gioi-thieu">{translate('footer.about')}</Link>
                            </li>
                            <li>
                                <Link to="/lien-he">{translate('footer.contact')}</Link>
                            </li>
                            <li>
                                <Link to="/dieu-khoan">{translate('footer.terms')}</Link>
                            </li>
                            <li>
                                <Link to="/chinh-sach">{translate('footer.privacy')}</Link>
                            </li>
                            <li>
                                <Link to="/khieu-nai">{translate('footer.copyright')}</Link>
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
                    <span>{translate('footer.followUs')}:</span>
                    <div className={cx('scroll-to-top', { visible: isVisible })} onClick={scrollToTop}>
                        <ArrowUpOutlined />
                    </div>
                </div>
            </div>
        </Footer>
    );
};

export default AppFooter;
