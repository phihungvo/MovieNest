import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Typography, Space, Tag, Tabs, Button, Row, Col, Descriptions, Spin 
} from 'antd';
import { 
  CaretRightOutlined, ShareAltOutlined, 
  WhatsAppOutlined, HeartOutlined, StarOutlined 
} from '@ant-design/icons';
import { getMovieImage } from '~/service/admin/uploadFile';
import { findMovieById } from '~/service/user/movie';
import './MovieDetail.less';

const { Title, Paragraph } = Typography;

function MovieDetail() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setLoading(true);
      try {
        const movieData = await findMovieById(movieId);
        
        const processedData = {
          id: movieId,
          title: movieData.title,
          overview: movieData.overview,
          releaseDate: new Date(movieData.releaseDate).toLocaleDateString('vi-VN'),
          posterPath: movieData.posterPath,
          backdropPath: movieData.backdropPath,
          voteAverage: movieData.voteAverage,
          genres: movieData.genres?.map(genre => genre.name) || [],
          runtime: movieData.runtime,
          director: movieData.director || 'Chưa cập nhật',
          actors: movieData.actors || ['Chưa cập nhật'],
          episodeCount: movieData.episodeCount || 0,
          year: new Date(movieData.releaseDate).getFullYear() || 'N/A',
          country: movieData.country || 'Chưa cập nhật',
          rating: movieData.voteAverage || 0
        };

        setMovie(processedData);

        // Load hình ảnh
        if (movieData.posterPath) {
          try {
            if (movieData.posterPath.startsWith('http')) {
              setImageUrl(movieData.posterPath);
            } else if (!movieData.posterPath.includes('/api/')) {
              setImageUrl(`https://image.tmdb.org/t/p/w500${movieData.posterPath}`);
            } else {
              const imgUrl = await getMovieImage(movieData.posterPath);
              setImageUrl(imgUrl);
            }
          } catch (error) {
            console.error('Lỗi khi tải hình ảnh phim:', error);
            setImageUrl('/images/default-movie-poster.jpg');
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải chi tiết phim:', error);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetail();
    }
  }, [movieId]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Đang tải thông tin phim..." />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="error-container">
        <Typography.Text type="danger">Không tìm thấy thông tin phim!</Typography.Text>
      </div>
    );
  }

  const buttonOptions = [
    {
      title: 'Chiếu phát',
      icon: <CaretRightOutlined />,
      primary: true
    },
    {
      title: 'Chia sẻ',
      icon: <ShareAltOutlined />,
    },
    {
      title: 'APP',
      icon: <WhatsAppOutlined />,
    },
    {
      title: 'Sưu tập',
      icon: <HeartOutlined />,
    },
  ];

  return (
    <div className="movie-detail-container">
      {/* Backdrop với gradient overlay */}
      <div 
        className="backdrop-container"
      >
        <div 
          className="backdrop-image"
          style={{ backgroundImage: `url(${movie.backdropPath})` }}
        />
        <div className="backdrop-gradient" />
      </div>

      {/* Nội dung chính */}
      <div className="content-container">
        <Row>
          <Col xs={24} md={12}>
            <div className="movie-header">
              <Title level={1} className="movie-title">{movie.title}</Title>
              
              <Space className="movie-stats">
                <span className="rating">
                  <StarOutlined /> {movie.rating.toFixed(1)}
                </span>
                {movie.year && <span className="stat-item">| {movie.year}</span>}
                {movie.episodeCount > 0 && <span className="stat-item">| {movie.episodeCount} tập</span>}
              </Space>
              
              <div className="movie-tags">
                {movie.country && <Tag className="tag">{movie.country}</Tag>}
                {movie.genres?.map((genre, index) => (
                  <Tag key={index} className="tag">{genre}</Tag>
                ))}
              </div>
              
              <div className="crew-info">
                <div className="crew-item">
                  <span className="crew-label">Đạo diễn:</span>
                  <span className="crew-value">{movie.director}</span>
                </div>
                <div className="crew-item">
                  <span className="crew-label">Diễn viên chính:</span>
                  <span className="crew-value">
                    {Array.isArray(movie.actors) ? movie.actors.join(', ') : movie.actors}
                  </span>
                </div>
              </div>
              
              <div className="movie-description">
                <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}>
                  {movie.overview}
                </Paragraph>
              </div>
              
              <div className="action-buttons">
                {buttonOptions.map((btn, index) => (
                  <Button 
                    key={index}
                    type={btn.primary ? "primary" : "default"}
                    icon={btn.icon}
                    className={btn.primary ? "btn-primary" : "btn-secondary"}
                  >
                    {btn.title}
                  </Button>
                ))}
              </div>
            </div>
          </Col>
        </Row>
        
        <div className="custom-tabs-container">
          <div className="tabs-header">
            <div 
              className={`tab-item ${activeTab === '1' ? 'active' : ''}`}
              onClick={() => setActiveTab('1')}
            >
              Chọn tập
            </div>
            <div 
              className={`tab-item ${activeTab === '2' ? 'active' : ''}`}
              onClick={() => setActiveTab('2')}
            >
              Diễn viên
            </div>
            <div 
              className={`tab-item ${activeTab === '3' ? 'active' : ''}`}
              onClick={() => setActiveTab('3')}
            >
              Đề xuất cho bạn
            </div>
          </div>
          
          <div className="tab-content">
            {activeTab === '1' && (
              <div className="tab-pane">
                Danh sách tập phim sẽ hiển thị ở đây.
              </div>
            )}
            
            {activeTab === '2' && (
              <div className="tab-pane">
                <Descriptions title="Thông tin diễn viên" bordered>
                  <Descriptions.Item label="Diễn viên" span={3}>
                    {Array.isArray(movie.actors) ? movie.actors.join(', ') : movie.actors}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            )}
            
            {activeTab === '3' && (
              <div className="tab-pane">
                Phim đề xuất cho bạn sẽ hiển thị ở đây.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;