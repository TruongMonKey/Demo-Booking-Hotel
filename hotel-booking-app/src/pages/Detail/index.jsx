// src/pages/Detail/index.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Breadcrumb,
  Button,
  DatePicker,
  Tag,
  Row,
  Col,
  Table,
  Tooltip,
  Progress,
  message
} from 'antd';
import {
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  StarFilled,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  CheckCircleOutlined,
  WifiOutlined,
  CarOutlined,
  CoffeeOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
  HomeOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getHotelByID } from '../../Service/HotelService';
import './Detail.scss';

const { RangePicker } = DatePicker;

export default function Detail() {
  const param = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState([
    dayjs().add(1, 'day'),
    dayjs().add(3, 'day')
  ]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Fetch Hotel
  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      try {
        const response = await getHotelByID(param.id);
        const data = typeof response === 'object' && response?.data ? response.data : response;
        setHotel(data);
      } catch (err) {
        console.error('Lỗi khi tải thông tin khách sạn:', err);
      } finally {
        setLoading(false);
      }
    };
    if (param.id) {
      fetchHotel();
    }
  }, [param.id]);

  const numberOfNights = useMemo(() => {
    if (!selectedDates || !selectedDates[0] || !selectedDates[1]) return 1;
    const diff = selectedDates[1].diff(selectedDates[0], 'day');
    return Math.max(1, diff);
  }, [selectedDates]);

  const handleScrollToBooking = () => {
    const el = document.getElementById('roomAvailabilitySection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookRoom = (room) => {
    if (!selectedDates || !selectedDates[0] || !selectedDates[1]) {
      message.warning('Vui lòng chọn ngày nhận phòng và trả phòng!');
      handleScrollToBooking();
      return;
    }

    const checkInDate = selectedDates[0].format('YYYY-MM-DD');
    const checkOutDate = selectedDates[1].format('YYYY-MM-DD');

    const bookingData = {
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelAddress: hotel.address,
      roomId: room.id,
      roomName: room.name,
      pricePerNight: room.price,
      totalPrice: room.price * numberOfNights,
      numberOfNights,
      checkInDate,
      checkOutDate,
    };

    navigate('/payment', { state: { bookingData } });
  };

  const images = useMemo(() => {
    if (hotel?.images && hotel.images.length > 0) {
      return hotel.images.map((img) => (typeof img === 'string' ? img : img.imageUrl));
    }
    if (hotel?.thumbnailUrl) {
      return [hotel.thumbnailUrl];
    }
    return [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80'
    ];
  }, [hotel]);

  const roomColumns = [
    {
      title: 'Loại phòng & Chi tiết',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="ota-room-type-cell">
          <h4 className="room-title">{text || 'Phòng nghỉ cao cấp'}</h4>
          <div className="room-features">
            <span>Diện tích: <strong>{record.roomArea || 32} m²</strong></span>
            <span>Giường: <strong>{record.quantityBed || 1} giường lớn</strong></span>
          </div>
          <div className="room-amenities-tags">
            {record.amenities && record.amenities.length > 0 ? (
              record.amenities.map((item, idx) => (
                <Tag color="cyan" key={idx}>
                  {item.name || item}
                </Tag>
              ))
            ) : (
              <>
                <Tag color="cyan">Wi-Fi miễn phí</Tag>
                <Tag color="cyan">Điều hòa</Tag>
                <Tag color="cyan">TV màn hình phẳng</Tag>
              </>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Số lượng khách',
      dataIndex: 'quantityPeople',
      key: 'quantityPeople',
      width: 140,
      render: (val) => (
        <div className="ota-room-guest-cell">
          <div className="guest-icons">
            {Array.from({ length: Math.min(val || 2, 4) }).map((_, i) => (
              <UserOutlined key={i} style={{ fontSize: '15px', color: '#1e293b' }} />
            ))}
          </div>
          <span className="guest-text">{val || 2} người lớn</span>
        </div>
      ),
    },
    {
      title: 'Điều kiện & Ưu đãi',
      key: 'conditions',
      width: 220,
      render: () => (
        <div className="ota-room-conditions">
          <div className="condition perk">
            <CheckCircleOutlined /> Miễn phí hủy phòng
          </div>
          <div className="condition perk">
            <CheckCircleOutlined /> Thanh toán tại khách sạn
          </div>
          <div className="condition perk">
            <CheckCircleOutlined /> Bao gồm bữa sáng thịnh soạn
          </div>
        </div>
      ),
    },
    {
      title: `Giá cho ${numberOfNights} đêm`,
      dataIndex: 'price',
      key: 'price',
      width: 200,
      render: (price, record) => {
        const total = (price || 1200000) * numberOfNights;
        return (
          <div className="ota-room-price-cell">
            <div className="price-total">
              VND <strong>{total.toLocaleString('vi-VN')}</strong>
            </div>
            <div className="price-per-night">
              {Number(price).toLocaleString('vi-VN')}₫ / đêm
            </div>
            <div className="tax-note">Đã bao gồm thuế và phí</div>
          </div>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Button
          type="primary"
          className="ota-book-room-btn"
          onClick={() => handleBookRoom(record)}
        >
          Đặt ngay <ArrowRightOutlined />
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="ota-detail-loading">
        <Navbar />
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Đang tải thông tin khách sạn...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="ota-detail-page">
        <Navbar />
        <div className="ota-detail-empty">
          <h2>Không tìm thấy khách sạn</h2>
          <Link to="/discover">
            <Button type="primary">Quay lại danh sách</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const rate = hotel.rate || 4.8;

  return (
    <div className="ota-detail-page">
      <Navbar activeTab="stays" />

      <main className="ota-detail-main">
        <div className="ota-detail-container">
          {/* Breadcrumb Navigation */}
          <div className="ota-detail-breadcrumb">
            <Breadcrumb
              items={[
                {
                  title: (
                    <Link to="/">
                      <HomeOutlined /> Trang chủ
                    </Link>
                  ),
                },
                {
                  title: <Link to="/discover">Khám phá</Link>,
                },
                {
                  title: hotel.city || 'Khách sạn',
                },
                {
                  title: hotel.name,
                },
              ]}
            />
          </div>

          {/* Hotel Header Section */}
          <section className="ota-detail-header">
            <div className="ota-detail-header__left">
              <div className="ota-detail-header__type-row">
                <Tag color="blue" className="ota-type-tag">Khách sạn 5 sao</Tag>
                <div className="ota-detail-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarFilled
                      key={i}
                      style={{
                        color: i < Math.floor(rate) ? '#f59e0b' : '#e2e8f0',
                        fontSize: '14px'
                      }}
                    />
                  ))}
                </div>
              </div>

              <h1 className="ota-detail-name">{hotel.name}</h1>

              <div className="ota-detail-address">
                <EnvironmentOutlined className="icon" />
                <span>{hotel.address}</span>
                {hotel.linkMap && (
                  <a
                    href={hotel.linkMap}
                    target="_blank"
                    rel="noreferrer"
                    className="map-link"
                  >
                    — Hiển thị trên Google Maps
                  </a>
                )}
              </div>
            </div>

            <div className="ota-detail-header__actions">
              <button
                className={`action-btn ${isFavorite ? 'active' : ''}`}
                onClick={() => setIsFavorite(!isFavorite)}
                title="Lưu vào danh sách yêu thích"
              >
                {isFavorite ? <HeartFilled style={{ color: '#e11d48' }} /> : <HeartOutlined />}
              </button>

              <button
                className="action-btn"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  message.success('Đã sao chép liên kết vào bộ nhớ tạm!');
                }}
                title="Chia sẻ liên kết"
              >
                <ShareAltOutlined />
              </button>

              <Button
                type="primary"
                className="ota-top-book-btn"
                onClick={handleScrollToBooking}
              >
                Đặt ngay
              </Button>
            </div>
          </section>

          {/* Photo Gallery Grid */}
          <section className="ota-gallery">
            <div className="ota-gallery__hero">
              <img src={images[activePhotoIdx] || images[0]} alt={hotel.name} />
            </div>
            <div className="ota-gallery__grid">
              {images.slice(0, 4).map((imgUrl, idx) => (
                <div
                  key={idx}
                  className={`ota-gallery__thumb ${activePhotoIdx === idx ? 'active' : ''}`}
                  onClick={() => setActivePhotoIdx(idx)}
                >
                  <img src={imgUrl} alt={`Ảnh ${idx + 1}`} />
                </div>
              ))}
            </div>
          </section>

          {/* Quick Jump Navigation */}
          <nav className="ota-jump-nav">
            <a href="#overviewSection">Tổng quan</a>
            <a href="#amenitiesSection">Tiện nghi</a>
            <a href="#roomAvailabilitySection">Phòng trống & Giá</a>
            <a href="#mapSection">Vị trí & Bản đồ</a>
            <a href="#reviewsSection">Đánh giá khách hàng</a>
          </nav>

          {/* Overview & Key Highlights Section */}
          <section id="overviewSection" className="ota-overview-section">
            <Row gutter={[24, 24]}>
              <Col xs={24} md={16}>
                <div className="ota-description-box">
                  <h3>Giới thiệu về {hotel.name}</h3>
                  <p className="description-text">
                    {hotel.description ||
                      'Tọa lạc tại vị trí đắc địa với không gian nghỉ dưỡng đẳng cấp quốc tế, khách sạn mang đến sự kết hợp hoàn hảo giữa phong cách thiết kế sang trọng và lòng hiếu khách chu đáo.'}
                  </p>
                  <p className="description-text">
                    Quý khách có thể thưởng thức ẩm thực tinh tế tại các nhà hàng cao cấp, thư giãn bên hồ bơi ngoài trời hoặc trải nghiệm các liệu trình chăm sóc sức khỏe tại khu spa riêng biệt.
                  </p>

                  <div className="ota-checkin-info">
                    <div className="check-time">
                      <span>Nhận phòng:</span>
                      <strong>Từ {hotel.checkInTime || '14:00'}</strong>
                    </div>
                    <div className="check-time">
                      <span>Trả phòng:</span>
                      <strong>Trước {hotel.checkOutTime || '12:00'}</strong>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={24} md={8}>
                <div className="ota-highlight-card">
                  <div className="rating-top">
                    <div className="score-badge">{Number(rate).toFixed(1)}</div>
                    <div className="score-desc">
                      <h4>Xuất sắc</h4>
                      <span>{hotel.reviewsCount || 340} đánh giá thực tế</span>
                    </div>
                  </div>

                  <div className="highlights-list">
                    <div className="highlight-item">
                      <CheckCircleOutlined className="icon" />
                      <span>Vị trí hàng đầu: 9.6 / 10</span>
                    </div>
                    <div className="highlight-item">
                      <CheckCircleOutlined className="icon" />
                      <span>Bữa sáng buffet thịnh soạn</span>
                    </div>
                    <div className="highlight-item">
                      <CheckCircleOutlined className="icon" />
                      <span>Được du khách quay lại nhiều nhất</span>
                    </div>
                    <div className="highlight-item">
                      <CheckCircleOutlined className="icon" />
                      <span>Nhân viên hỗ trợ 24/7 nhiệt tình</span>
                    </div>
                  </div>

                  <Button
                    type="primary"
                    block
                    className="highlight-cta-btn"
                    onClick={handleScrollToBooking}
                  >
                    Xem phòng trống & Giá
                  </Button>
                </div>
              </Col>
            </Row>
          </section>

          {/* Amenities Section */}
          <section id="amenitiesSection" className="ota-amenities-section">
            <h3 className="section-title">Tiện nghi được ưa chuộng nhất</h3>
            <div className="amenities-grid">
              <div className="amenity-chip">
                <WifiOutlined className="icon" /> Wi-Fi tốc độ cao miễn phí
              </div>
              <div className="amenity-chip">
                <CoffeeOutlined className="icon" /> Bữa sáng buffet ngon miệng
              </div>
              <div className="amenity-chip">
                <CarOutlined className="icon" /> Chỗ đỗ xe miễn phí trong khuôn viên
              </div>
              <div className="amenity-chip">
                <SafetyCertificateOutlined className="icon" /> Lễ tân phục vụ 24 giờ
              </div>
              <div className="amenity-chip">
                <CheckCircleOutlined className="icon" /> Hồ bơi ngoài trời vô cực
              </div>
              <div className="amenity-chip">
                <CheckCircleOutlined className="icon" /> Trung tâm spa & chăm sóc sức khỏe
              </div>
            </div>
          </section>

          {/* Room Availability Section */}
          <section id="roomAvailabilitySection" className="ota-availability-section">
            <div className="availability-header">
              <div>
                <h3 className="section-title">Phòng trống và Bảng giá</h3>
                <p className="section-subtitle">
                  Giá hiển thị cho <strong>{numberOfNights} đêm</strong> (
                  {selectedDates?.[0]?.format('DD/MM/YYYY')} — {selectedDates?.[1]?.format('DD/MM/YYYY')}
                  )
                </p>
              </div>

              {/* Date selector banner */}
              <div className="ota-date-change-box">
                <span className="label">
                  <CalendarOutlined /> Thay đổi ngày lưu trú:
                </span>
                <RangePicker
                  value={selectedDates}
                  onChange={(dates) => setSelectedDates(dates)}
                  format="DD/MM/YYYY"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                  className="detail-date-picker"
                />
              </div>
            </div>

            {/* Room Table */}
            <div className="ota-room-table-wrap">
              <Table
                dataSource={hotel.roomTypes || []}
                columns={roomColumns}
                rowKey="id"
                pagination={false}
                bordered
              />
            </div>
          </section>

          {/* Location Map Section */}
          <section id="mapSection" className="ota-map-section">
            <h3 className="section-title">Vị trí và Khu vực xung quanh</h3>
            <div className="ota-map-box">
              <iframe
                title="Bản đồ khách sạn"
                src={`https://www.google.com/maps?q=${encodeURIComponent(hotel.address)}&output=embed`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="google-map-iframe"
              />
            </div>
          </section>

          {/* Guest Reviews Breakdown */}
          <section id="reviewsSection" className="ota-reviews-section">
            <h3 className="section-title">Đánh giá của khách hàng</h3>
            <div className="reviews-summary-card">
              <Row gutter={[30, 20]} align="middle">
                <Col xs={24} sm={8} className="overall-score-col">
                  <div className="big-score">{Number(rate).toFixed(1)}</div>
                  <div className="score-level">Xuất sắc</div>
                  <div className="score-count">{hotel.reviewsCount || 342} đánh giá đã được xác thực</div>
                </Col>

                <Col xs={24} sm={16}>
                  <div className="score-bars">
                    <div className="bar-row">
                      <span className="bar-label">Vị trí</span>
                      <Progress percent={96} size="small" strokeColor="#003580" showInfo={false} />
                      <span className="bar-num">9.6</span>
                    </div>
                    <div className="bar-row">
                      <span className="bar-label">Độ sạch sẽ</span>
                      <Progress percent={94} size="small" strokeColor="#003580" showInfo={false} />
                      <span className="bar-num">9.4</span>
                    </div>
                    <div className="bar-row">
                      <span className="bar-label">Dịch vụ & Nhân viên</span>
                      <Progress percent={93} size="small" strokeColor="#003580" showInfo={false} />
                      <span className="bar-num">9.3</span>
                    </div>
                    <div className="bar-row">
                      <span className="bar-label">Tiện nghi phòng</span>
                      <Progress percent={91} size="small" strokeColor="#003580" showInfo={false} />
                      <span className="bar-num">9.1</span>
                    </div>
                    <div className="bar-row">
                      <span className="bar-label">Đáng giá tiền</span>
                      <Progress percent={90} size="small" strokeColor="#003580" showInfo={false} />
                      <span className="bar-num">9.0</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
