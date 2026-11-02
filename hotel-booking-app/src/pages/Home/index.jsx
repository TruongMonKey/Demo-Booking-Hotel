// src/pages/Home/index.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Layout, Pagination } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  CompassOutlined,
  FireOutlined
} from '@ant-design/icons';
import { BsArrowRight } from 'react-icons/bs';

import video_background from '../../videos/video_background3.mp4';
import LanguageSelector from '../../components/LanguageSelector';
import TopMenu from '../../components/TopMenu';
import HotelSearch from '../../components/Search';
import GridHotel from '../../components/GridHotel';
import Footer from '../../components/Footer';

import { getHotels } from '../../Service/HotelService';
import { POPULAR_DESTINATIONS } from '../../mock/hotelsData';
import './Home.scss';

const { Content } = Layout;

function capitalizeWords(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function Home() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const token = localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    localStorage.removeItem('phone');
    localStorage.removeItem('roles');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/');
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await getHotels();
        const list = Array.isArray(response) ? response : (response?.data ?? []);
        setHotels(list);
      } catch (err) {
        console.error('Lỗi khi tải danh sách khách sạn:', err);
      }
    };
    fetchHotels();
  }, []);

  const handleDestinationClick = (city) => {
    navigate(`/discover?keyword=${encodeURIComponent(city)}`);
  };

  // Filtered hotels based on selected category tab
  const filteredHotels = useMemo(() => {
    if (activeCategory === 'beach') {
      return hotels.filter(
        (h) =>
          (h.address &&
            (h.address.includes('Đà Nẵng') ||
              h.address.includes('Nha Trang') ||
              h.address.includes('Phú Quốc'))) ||
          (h.name &&
            (h.name.includes('Beach') ||
              h.name.includes('Bay') ||
              h.name.includes('Ocean')))
      );
    }
    if (activeCategory === 'luxury') {
      return hotels.filter((h) => (h.rate || 0) >= 4.8);
    }
    if (activeCategory === 'budget') {
      return hotels.filter((h) => {
        const price = h.roomTypes?.[0]?.price || 0;
        return price > 0 && price <= 2500000;
      });
    }
    return hotels;
  }, [hotels, activeCategory]);

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredHotels.slice(start, start + pageSize);
  }, [filteredHotels, currentPage, pageSize]);

  const propertyTypes = [
    {
      title: 'Khách sạn',
      count: '12,500+ chỗ nghỉ',
      image:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Khu nghỉ dưỡng (Resorts)',
      count: '2,800+ chỗ nghỉ',
      image:
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Căn hộ cao cấp',
      count: '8,400+ chỗ nghỉ',
      image:
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Biệt thự nghỉ dưỡng',
      count: '1,900+ chỗ nghỉ',
      image:
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=500&q=80',
    },
  ];

  return (
    <Layout className="layout-welcome">
      {/* Original Video Background Introduction */}
      <header className="layout-welcome__header">
        <div className="video-background">
          <video autoPlay loop muted playsInline>
            <source src={video_background} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>

          <div className="content">
            <div className="login-language">
              {token ? (
                <Link onClick={handleLogout} className="auth-link">
                  Đăng xuất <LeftOutlined /> /
                </Link>
              ) : (
                <Link to="/auth" className="auth-link">
                  Đăng nhập <RightOutlined /> /
                </Link>
              )}

              <LanguageSelector />

              <div className="profile">
                {token ? (
                  <Link to="/profile" className="profile-link">
                    {capitalizeWords(localStorage.getItem('fullName') || '')}
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="logo">
              <Link to="/">HotelBooking.com</Link>
            </div>

            <div className="menu">
              <TopMenu />
            </div>

            <div className="title">Tìm chỗ nghỉ tiếp theo</div>
            <div className="desciption">
              Tìm ưu đãi khách sạn, chỗ nghỉ dạng nhà và nhiều hơn nữa...
            </div>

            <Button className="button-discover">
              <Link to="/discover">
                <span>Khám phá</span>
                <BsArrowRight />
              </Link>
            </Button>
          </div>
        </div>

        {/* Thanh tìm kiếm OTA tích hợp */}
        <div className="search">
          <div className="ota-search-wrapper">
            <HotelSearch />
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <Content className="layout-welcome__conten">
        {/* Special Promos Section */}
        <section className="ota-promo-section">
          <div className="ota-promo-card ota-promo-card--summer">
            <div className="ota-promo-card__content">
              <span className="ota-promo-card__tag">Ưu đãi mùa du lịch</span>
              <h3>Kỳ nghỉ biển rực rỡ — Tiết kiệm đến 30%</h3>
              <p>Thư giãn tại các bãi biển đẹp nhất Việt Nam với giá phòng ưu đãi độc quyền.</p>
              <Button
                type="primary"
                className="ota-promo-card__btn"
                onClick={() => navigate('/discover?keyword=Đà Nẵng')}
              >
                Khám phá ngay
              </Button>
            </div>
          </div>

          <div className="ota-promo-card ota-promo-card--genius">
            <div className="ota-promo-card__content">
              <span className="ota-promo-card__tag">Chương trình thành viên</span>
              <h3>Tiết kiệm 10% cho mỗi chuyến đi</h3>
              <p>Đăng nhập hoặc tạo tài khoản để tự động nhận mức giá ưu đãi thành viên Genius.</p>
              <Button
                className="ota-promo-card__btn ota-promo-card__btn--outline"
                onClick={() => navigate('/auth')}
              >
                Đăng ký / Đăng nhập
              </Button>
            </div>
          </div>
        </section>

        {/* Popular Destinations in Vietnam */}
        <section className="ota-home-section">
          <div className="ota-home-section__header">
            <div>
              <h2 className="ota-home-section__title">
                <CompassOutlined className="icon-blue" /> Điểm đến thịnh hành
              </h2>
              <p className="ota-home-section__subtitle">
                Những điểm đến được du khách từ khắp nơi yêu thích và đặt nhiều nhất
              </p>
            </div>
          </div>

          <div className="ota-destinations-grid">
            {POPULAR_DESTINATIONS.map((dest) => (
              <div
                key={dest.id}
                className="ota-dest-card"
                onClick={() => handleDestinationClick(dest.name)}
              >
                <div className="ota-dest-card__image-wrap">
                  <img src={dest.image} alt={dest.name} loading="lazy" />
                  <div className="ota-dest-card__overlay">
                    <span className="ota-dest-card__tag">{dest.tag}</span>
                    <h3 className="ota-dest-card__name">{dest.name}</h3>
                    <span className="ota-dest-card__count">{dest.properties}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Property Types */}
        <section className="ota-home-section">
          <div className="ota-home-section__header">
            <div>
              <h2 className="ota-home-section__title">Tìm theo loại chỗ nghỉ</h2>
              <p className="ota-home-section__subtitle">
                Lựa chọn không gian nghỉ ngơi phù hợp nhất với phong cách chuyến đi của bạn
              </p>
            </div>
          </div>

          <div className="ota-property-types-grid">
            {propertyTypes.map((type, idx) => (
              <div
                key={idx}
                className="ota-type-card"
                onClick={() => navigate('/discover')}
              >
                <div className="ota-type-card__image-wrap">
                  <img src={type.image} alt={type.title} loading="lazy" />
                </div>
                <div className="ota-type-card__info">
                  <h4>{type.title}</h4>
                  <p>{type.count}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Hotels */}
        <section className="ota-home-section">
          <div className="ota-home-section__header">
            <div>
              <h2 className="ota-home-section__title">
                <FireOutlined className="icon-orange" /> Gợi ý các chỗ nghỉ cho bạn
              </h2>
              <p className="ota-home-section__subtitle">
                Khách sạn và khu nghỉ dưỡng được đánh giá cao nhất về vị trí và chất lượng phục vụ
              </p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="ota-category-tabs">
            <button
              className={`ota-cat-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('all');
                setCurrentPage(1);
              }}
            >
              Tất cả chỗ nghỉ
            </button>
            <button
              className={`ota-cat-btn ${activeCategory === 'beach' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('beach');
                setCurrentPage(1);
              }}
            >
              Nghỉ dưỡng ven biển
            </button>
            <button
              className={`ota-cat-btn ${activeCategory === 'luxury' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('luxury');
                setCurrentPage(1);
              }}
            >
              Sang trọng 5 sao
            </button>
            <button
              className={`ota-cat-btn ${activeCategory === 'budget' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('budget');
                setCurrentPage(1);
              }}
            >
              Giá tốt nhất
            </button>
          </div>

          <GridHotel data={currentPageData} />

          {filteredHotels.length > pageSize && (
            <div className="ota-pagination-wrap">
              <Pagination
                current={currentPage}
                total={filteredHotels.length}
                pageSize={pageSize}
                onChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 800, behavior: 'smooth' });
                }}
                showSizeChanger={false}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} của ${total} khách sạn`
                }
              />
            </div>
          )}
        </section>
      </Content>

      <Footer />
    </Layout>
  );
}
