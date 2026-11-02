// src/components/GridHotel/index.jsx
import React, { useState } from 'react';
import { Card, Col, Row, Tag, Tooltip } from 'antd';
import {
  EnvironmentOutlined,
  HeartOutlined,
  HeartFilled,
  CheckCircleOutlined,
  StarFilled,
  ArrowRightOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './GridHotel.scss';

export default function GridHotel({ data = [] }) {
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const hotels = Array.isArray(data) ? data : (data?.data || []);

  const getRatingLabel = (score) => {
    if (score >= 4.8) return 'Xuất sắc';
    if (score >= 4.5) return 'Tuyệt vời';
    if (score >= 4.0) return 'Rất tốt';
    return 'Hài lòng';
  };

  if (!hotels || hotels.length === 0) {
    return (
      <div className="ota-grid-hotel__empty">
        <h3>Không có khách sạn nào để hiển thị</h3>
        <p>Vui lòng thử lại với từ khóa hoặc địa điểm khác.</p>
      </div>
    );
  }

  return (
    <Row gutter={[20, 24]} className="ota-grid-hotel">
      {hotels.map((hotel, index) => {
        const img = hotel?.images?.[0]?.imageUrl || hotel?.thumbnailUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
        const roomType = hotel?.roomTypes?.[0];
        const price = roomType?.price || 1200000;
        const originalPrice = roomType?.originalPrice || Math.round(price * 1.25);
        const rate = hotel?.rate || 4.7;
        const isFav = !!favorites[hotel.id];
        const detailLink = `/discover/detail/${hotel.id}`;

        return (
          <Col xs={24} sm={12} md={8} lg={6} key={hotel.id || index}>
            <div className="ota-hotel-card">
              <Link to={detailLink} className="ota-hotel-card__link">
                {/* Image Section */}
                <div className="ota-hotel-card__image-wrap">
                  <img src={img} alt={hotel.name} className="ota-hotel-card__image" loading="lazy" />
                  
                  {/* Heart Favorite Button */}
                  <button
                    className={`ota-hotel-card__fav-btn ${isFav ? 'active' : ''}`}
                    onClick={(e) => toggleFavorite(e, hotel.id)}
                    title="Lưu vào danh sách yêu thích"
                  >
                    {isFav ? <HeartFilled style={{ color: '#e11d48' }} /> : <HeartOutlined />}
                  </button>

                  {/* Promo Badge */}
                  {originalPrice > price && (
                    <div className="ota-hotel-card__promo-badge">
                      Ưu đãi hè
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="ota-hotel-card__body">
                  <div className="ota-hotel-card__header">
                    <h3 className="ota-hotel-card__name" title={hotel.name}>
                      {hotel.name}
                    </h3>
                    <div className="ota-hotel-card__stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarFilled
                          key={i}
                          style={{
                            color: i < Math.floor(rate) ? '#f59e0b' : '#e2e8f0',
                            fontSize: '12px'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="ota-hotel-card__location" title={hotel.address}>
                    <EnvironmentOutlined className="icon" />
                    <span>{hotel.city || hotel.address}</span>
                  </div>

                  {/* Rating Score Banner */}
                  <div className="ota-hotel-card__rating">
                    <div className="ota-hotel-card__rating-text">
                      <span className="label">{getRatingLabel(rate)}</span>
                      <span className="reviews">{hotel.reviewsCount || 128} đánh giá</span>
                    </div>
                    <div className="ota-hotel-card__rating-badge">
                      {Number(rate).toFixed(1)}
                    </div>
                  </div>

                  {/* Perks / Tags */}
                  <div className="ota-hotel-card__perks">
                    <span className="perk">
                      <CheckCircleOutlined /> Miễn phí hủy
                    </span>
                    <span className="perk">
                      <CheckCircleOutlined /> Không cần trả trước
                    </span>
                  </div>

                  {/* Price Section */}
                  <div className="ota-hotel-card__footer">
                    <div className="ota-hotel-card__price-box">
                      <span className="ota-hotel-card__nights">1 đêm, 2 người lớn</span>
                      {originalPrice > price && (
                        <span className="ota-hotel-card__original-price">
                          VND {Number(originalPrice).toLocaleString('vi-VN')}
                        </span>
                      )}
                      <div className="ota-hotel-card__final-price">
                        <span className="currency">VND</span>
                        <span className="amount">{Number(price).toLocaleString('vi-VN')}</span>
                      </div>
                      <span className="ota-hotel-card__tax-note">Đã bao gồm thuế & phí</span>
                    </div>

                    <div className="ota-hotel-card__cta">
                      <span>Xem chỗ trống</span>
                      <ArrowRightOutlined className="arrow" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </Col>
        );
      })}
    </Row>
  );
}
