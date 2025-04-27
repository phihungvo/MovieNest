import React, { useState } from 'react';
import { Button, Tag, Typography, Rate, Space, Carousel } from 'antd';
import { PlayCircleOutlined, HeartOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import './banner.css';

const { Title, Text, Paragraph } = Typography;

const MovieBanner = () => {
  const carouselRef = React.useRef();
  
  // Sample movie data for carousel
  const movies = [
    {
      id: 1,
      title: 'VÔ ƯU ĐỘ',
      year: '2025',
      season: 'T13',
      episodes: 'Trọn bộ 36 tập',
      rating: 9.8,
      categories: [
        'Thuyết Minh',
        'Top Phim Thịnh Hành',
        'TOP 1',
        'iQIYI Sản Xuất'
      ],
      tags: [
        'Trung Quốc đại lục',
        'Viễn Tưởng',
        'Cổ Trang',
        'Tiếng Việt',
        'Tiểu Thuyết Chuyển Thể',
        'Cổ Đại',
        'Phiêu Lưu'
      ],
      description: '"Vô Ưu Độ" là một bộ phim truyền hình thuộc thể loại kinh dị, lãng mạn, do Lâm Ngọc Phàn đạo diễn, với sự tham gia của các diễn viên Nhậm Gia...',
      imageUrl: 'https://example.com/movie1.jpg',
      backgroundUrl: 'https://image.tmdb.org/t/p/original/zZ6nRdNQNxRnZ1LQ2ttPBZl9AXV.jpg'
    },
    {
      id: 2,
      title: 'KIM SINH KIẾP',
      year: '2024',
      season: 'T1',
      episodes: 'Trọn bộ 40 tập',
      rating: 9.5,
      categories: [
        'Thuyết Minh',
        'Top Phim Mới',
        'TOP 3',
        'Netflix'
      ],
      tags: [
        'Trung Quốc đại lục',
        'Lãng Mạn',
        'Cổ Trang',
        'Tiếng Việt',
        'Tiểu Thuyết Chuyển Thể',
        'Cổ Đại'
      ],
      description: '"Kim Sinh Kiếp" kể về câu chuyện tình yêu xuyên thời gian của một cặp đôi trải qua nhiều kiếp nạn và thử thách...',
      imageUrl: 'https://example.com/movie2.jpg',
      backgroundUrl: 'https://www.cdnzone.org/uploads/2021/04/17/Rom-2019-Banner.jpg'
    },
    {
      id: 3,
      title: 'HOA SƠN BIỆN KIẾM',
      year: '2025',
      season: 'T1',
      episodes: 'Trọn bộ 50 tập',
      rating: 9.3,
      categories: [
        'Thuyết Minh',
        'Top Phim Võ Thuật',
        'TOP 5',
        'Youku'
      ],
      tags: [
        'Trung Quốc đại lục',
        'Võ Thuật',
        'Cổ Trang',
        'Tiếng Việt',
        'Tiểu Thuyết Kiếm Hiệp',
        'Cổ Đại'
      ],
      description: '"Hoa Sơn Biện Kiếm" là câu chuyện về một môn phái võ học nổi tiếng và các cuộc tranh đấu trong giới võ lâm...',
      imageUrl: 'https://example.com/movie3.jpg',
      backgroundUrl: 'https://www.heavenofhorror.com/wp-content/uploads/2025/01/The-Woman-In-The-Yard-2025-Horror.jpg'
    },
    {
        id: 4,
        title: 'HOA SƠN BIỆN KIẾM',
        year: '2025',
        season: 'T1',
        episodes: 'Trọn bộ 50 tập',
        rating: 9.3,
        categories: [
          'Thuyết Minh',
          'Top Phim Võ Thuật',
          'TOP 5',
          'Youku'
        ],
        tags: [
          'Trung Quốc đại lục',
          'Võ Thuật',
          'Cổ Trang',
          'Tiếng Việt',
          'Tiểu Thuyết Kiếm Hiệp',
          'Cổ Đại'
        ],
        description: '"Hoa Sơn Biện Kiếm" là câu chuyện về một môn phái võ học nổi tiếng và các cuộc tranh đấu trong giới võ lâm...',
        imageUrl: 'https://example.com/movie3.jpg',
        backgroundUrl: 'https://kenh14cdn.com/203336854389633024/2025/2/3/ngang-24-1738517262290254814704-1738552346820-17385523555421053582285.jpg'
      },
      {
        id: 5,
        title: 'HOA SƠN BIỆN KIẾM',
        year: '2025',
        season: 'T1',
        episodes: 'Trọn bộ 50 tập',
        rating: 9.3,
        categories: [
          'Thuyết Minh',
          'Top Phim Võ Thuật',
          'TOP 5',
          'Youku'
        ],
        tags: [
          'Trung Quốc đại lục',
          'Võ Thuật',
          'Cổ Trang',
          'Tiếng Việt',
          'Tiểu Thuyết Kiếm Hiệp',
          'Cổ Đại'
        ],
        description: '"Hoa Sơn Biện Kiếm" là câu chuyện về một môn phái võ học nổi tiếng và các cuộc tranh đấu trong giới võ lâm...',
        imageUrl: 'https://example.com/movie3.jpg',
        backgroundUrl: 'https://www.heavenofhorror.com/wp-content/uploads/2024/03/exhuma-2024-horror-review.jpg'
      },
      {
        id: 6,
        title: 'HOA SƠN BIỆN KIẾM',
        year: '2025',
        season: 'T1',
        episodes: 'Trọn bộ 50 tập',
        rating: 9.3,
        categories: [
          'Thuyết Minh',
          'Top Phim Võ Thuật',
          'TOP 5',
          'Youku'
        ],
        tags: [
          'Trung Quốc đại lục',
          'Võ Thuật',
          'Cổ Trang',
          'Tiếng Việt',
          'Tiểu Thuyết Kiếm Hiệp',
          'Cổ Đại'
        ],
        description: '"Hoa Sơn Biện Kiếm" là câu chuyện về một môn phái võ học nổi tiếng và các cuộc tranh đấu trong giới võ lâm...',
        imageUrl: 'https://example.com/movie3.jpg',
        backgroundUrl: 'https://danaff.vn/wp-content/uploads/2023/04/2509_Poster_1.jpg'
      },
      {
        id: 7,
        title: 'HOA SƠN BIỆN KIẾM',
        year: '2025',
        season: 'T1',
        episodes: 'Trọn bộ 50 tập',
        rating: 9.3,
        categories: [
          'Thuyết Minh',
          'Top Phim Võ Thuật',
          'TOP 5',
          'Youku'
        ],
        tags: [
          'Trung Quốc đại lục',
          'Võ Thuật',
          'Cổ Trang',
          'Tiếng Việt',
          'Tiểu Thuyết Kiếm Hiệp',
          'Cổ Đại'
        ],
        description: '"Hoa Sơn Biện Kiếm" là câu chuyện về một môn phái võ học nổi tiếng và các cuộc tranh đấu trong giới võ lâm...',
        imageUrl: 'https://example.com/movie3.jpg',
        backgroundUrl: 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2024/06/beverly-hills-cop-4-axel-f.jpg'
      }
  ];

  const nextSlide = () => {
    carouselRef.current.next();
  };

  const prevSlide = () => {
    carouselRef.current.prev();
  };

  return (
    <div className="movie-banner-container">
      <Carousel ref={carouselRef} effect="fade" autoplay autoplaySpeed={5000} dots={false}>
        {movies.map((movie) => (
          <div key={movie.id}>
            <div 
              className="movie-banner" 
              style={{ 
                backgroundImage: `url(${movie.backgroundUrl})` 
              }}
            >
              <div className="movie-banner-overlay"></div>
              
              <div className="movie-content">
                <div className="movie-info">
                  <Title level={1} className="movie-title">{movie.title}</Title>
                  
                  <div className="movie-categories">
                    {movie.categories.map((category, index) => (
                      <Tag key={index} color={
                        index === 0 ? 'green' : 
                        index === 1 ? 'success' : 
                        index === 2 ? 'processing' : 
                        'warning'
                      }>
                        {category}
                      </Tag>
                    ))}
                  </div>
                  
                  <div className="movie-rating">
                    <Rate disabled defaultValue={5} value={movie.rating / 2} />
                    <Text className="rating-value">{movie.rating}</Text>
                    <Text className="movie-year">| {movie.year} | {movie.season} | {movie.episodes}</Text>
                  </div>
                  
                  <div className="movie-tags">
                    {movie.tags.map((tag, index) => (
                      <Tag key={index} className="movie-tag">{tag}</Tag>
                    ))}
                  </div>
                  
                  <Paragraph className="movie-description">
                    {movie.description}
                  </Paragraph>
                  
                  <Space size="middle" className="action-buttons">
                    <Button type="primary" shape="round" icon={<PlayCircleOutlined />} size="large">
                      Xem ngay
                    </Button>
                    <Button shape="circle" icon={<HeartOutlined />} size="large" className="favorite-button" />
                  </Space>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
      
      {/* Custom navigation arrows */}
      <Button 
        className="carousel-arrow prev" 
        icon={<LeftOutlined />} 
        onClick={prevSlide}
      />
      <Button 
        className="carousel-arrow next" 
        icon={<RightOutlined />} 
        onClick={nextSlide}
      />
      
      <div className="movie-suggested">
        <Text strong className="suggested-text">Đề xuất hot</Text>
      </div>
    </div>
  );
};

export default MovieBanner;