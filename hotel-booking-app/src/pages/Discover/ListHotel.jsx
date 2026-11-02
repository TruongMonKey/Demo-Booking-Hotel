// src/pages/Discover/ListHotel.jsx
import React, { useState } from 'react';
import { Button, Tag } from 'antd';
import {
  EnvironmentOutlined,
  CheckCircleOutlined,
  HeartOutlined,
  HeartFilled,
  StarFilled,
  RightOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Discover.scss';

export default function ListHotel({ data = [] }) {
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getRatingLabel = (rate) => {
    if (rate >= 4.8) return 'Xuất sắc';
    if (rate >= 4.5) return 'Tuyệt vời';
    if (rate >= 4.0) return 'Rất tốt';
    return 'Hài lòng';
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="ota-hotel-list">
      {data.map((hotel, index) => {
        const img =
          hotel?.images?.[0]?.imageUrl ||
          hotel?.thumbnailUrl ||
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
        const roomType = hotel?.roomTypes?.[0];
        const price = roomType?.price || 1200000;
        const originalPrice = roomType?.originalPrice || Math.round(price * 1.25);
        const rate = hotel?.rate || 4.7;
        const isFav = !!favorites[hotel.id];
        const detailLink = `/discover/detail/${hotel.id}`;

        return (
          <div className="ota-list-card" key={hotel.id || index}>
            {/* Left Image Section */}
            <div className="ota-list-card__image-box">
              <Link to={detailLink}>
                <img src={img} alt={hotel.name} className="ota-list-card__image" loading="lazy" />
              </Link>
              <button
                className={`ota-list-card__fav-btn ${isFav ? 'active' : ''}`}
                onClick={(e) => toggleFavorite(e, hotel.id)}
                title="Lưu vào yêu thích"
              >
                {isFav ? <HeartFilled style={{ color: '#e11d48' }} /> : <HeartOutlined />}
              </button>
              {originalPrice > price && (
                <div className="ota-list-card__badge">Ưu đãi hôm nay</div>
              )}
            </div>

            {/* Middle Content Section */}
            <div className="ota-list-card__main">
              <div className="ota-list-card__header">
                <div>
                  <div className="ota-list-card__title-row">
                    <Link to={detailLink} className="ota-list-card__title">
                      {hotel.name}
                    </Link>
                    <div className="ota-list-card__stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarFilled
                          key={i}
                          style={{
                            color: i < Math.floor(rate) ? '#f59e0b' : '#e2e8f0',
                            fontSize: '13px'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="ota-list-card__address">
                    <EnvironmentOutlined className="icon" />
                    <span>{hotel.address}</span>
                    {hotel.linkMap && (
                      <a
                        href={hotel.linkMap}
                        target="_blank"
                        rel="noreferrer"
                        className="map-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        · Xem trên bản đồ
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Room details / perks */}
              <div className="ota-list-card__room-info">
                <div className="room-name">
                  <strong>{roomType?.name || 'Phòng Deluxe Tiêu Chuẩn'}</strong>
                </div>
                <div className="bed-info">
                  {roomType?.quantityBed || 1} giường lớn · Diện tích: {roomType?.roomArea || 32} m²
                </div>

                <div className="ota-list-card__perks">
                  <span className="perk">
                    <CheckCircleOutlined /> Miễn phí hủy phòng
                  </span>
                  <span className="perk">
                    <CheckCircleOutlined /> Không cần thanh toán trước — thanh toán tại chỗ nghỉ
                  </span>
                  <span className="perk perk--green">
                    <CheckCircleOutlined /> Bao gồm bữa sáng thịnh soạn
                  </span>
                </div>
              </div>
            </div>

            {/* Right Price & Booking Column */}
            <div className="ota-list-card__side">
              {/* Rating score badge */}
              <div className="ota-list-card__rating">
                <div className="score-text">
                  <span className="label">{getRatingLabel(rate)}</span>
                  <span className="reviews">{hotel.reviewsCount || 128} đánh giá</span>
                </div>
                <div className="score-badge">{Number(rate).toFixed(1)}</div>
              </div>

              {/* Price box */}
              <div className="ota-list-card__price-box">
                <span className="nights-desc">1 đêm, 2 người lớn</span>
                {originalPrice > price && (
                  <span className="original-price">
                    VND {Number(originalPrice).toLocaleString('vi-VN')}
                  </span>
                )}
                <div className="final-price">
                  <span className="curr">VND</span>
                  <span className="num">{Number(price).toLocaleString('vi-VN')}</span>
                </div>
                <span className="tax-desc">Đã bao gồm thuế và phí</span>
              </div>

              {/* CTA Button */}
              <Link to={detailLink} className="ota-list-card__btn-wrap">
                <Button type="primary" className="ota-list-card__cta-btn">
                  <span>Xem chỗ trống</span>
                  <RightOutlined />
                </Button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
