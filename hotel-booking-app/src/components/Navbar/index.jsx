import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Dropdown, Avatar } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  BookOutlined,
  QuestionCircleOutlined,
  GlobalOutlined,
  HomeOutlined,
  RocketOutlined,
  CarOutlined,
  AppstoreOutlined,
  CreditCardOutlined,
  ShopOutlined
} from '@ant-design/icons';
import './Navbar.scss';

export default function Navbar({ activeTab = 'stays' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('accessToken');
  const fullName = localStorage.getItem('fullName') || 'Khách';
  const rolesString = localStorage.getItem('roles');
  const roles = rolesString ? JSON.parse(rolesString) : [];
  const isAdmin = roles.includes('ROLE_ADMIN') || roles.includes('ROLE_MANAGER');

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

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">Tài khoản của tôi</Link>,
    },
    {
      key: 'bookings',
      icon: <BookOutlined />,
      label: <Link to="/profile">Đơn đặt phòng & Chuyến đi</Link>,
    },
    ...(isAdmin
      ? [
          {
            type: 'divider',
          },
          {
            key: 'admin',
            icon: <DashboardOutlined />,
            label: <Link to="/admin">Trang quản trị (Admin)</Link>,
          },
        ]
      : []),
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: <span onClick={handleLogout}>Đăng xuất</span>,
    },
  ];

  const serviceTabs = [
    { key: 'stays', label: 'Lưu trú', icon: <HomeOutlined />, path: '/discover' },
    { key: 'flights', label: 'Chuyến bay', icon: <RocketOutlined />, disabled: true },
    { key: 'packages', label: 'Chuyến bay + Khách sạn', icon: <CreditCardOutlined />, disabled: true },
    { key: 'car-rentals', label: 'Thuê xe', icon: <CarOutlined />, disabled: true },
    { key: 'attractions', label: 'Địa điểm tham quan', icon: <AppstoreOutlined />, disabled: true },
    { key: 'airport-taxis', label: 'Taxi sân bay', icon: <ShopOutlined />, disabled: true },
  ];

  return (
    <nav className="ota-navbar">
      <div className="ota-navbar__top-container">
        {/* Brand Logo */}
        <Link to="/" className="ota-navbar__logo">
          <span className="ota-navbar__logo-main">HotelBooking</span>
          <span className="ota-navbar__logo-suffix">.com</span>
        </Link>

        {/* Right utility items */}
        <div className="ota-navbar__utilities">
          <button className="ota-navbar__util-btn" title="Tiền tệ">
            <span>VND</span>
          </button>

          <button className="ota-navbar__util-btn ota-navbar__flag-btn" title="Ngôn ngữ">
            <img
              src="https://t-cf.bstatic.com/design-assets/assets/v3.142.0/images-flags/Vn@3x.png"
              alt="Tiếng Việt"
              className="ota-navbar__flag-img"
            />
          </button>

          <button className="ota-navbar__util-btn ota-navbar__hide-mobile" title="Trợ giúp khách hàng">
            <QuestionCircleOutlined />
            <span>Trợ giúp</span>
          </button>

          <Link to="/admin" className="ota-navbar__list-property-btn ota-navbar__hide-mobile">
            Đăng chỗ nghỉ của bạn
          </Link>

          {/* User auth state */}
          {token ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div className="ota-navbar__user-profile">
                <Avatar style={{ backgroundColor: '#ffb700', color: '#1a202c', fontWeight: 'bold' }}>
                  {fullName.charAt(0).toUpperCase()}
                </Avatar>
                <span className="ota-navbar__user-name">{fullName}</span>
              </div>
            </Dropdown>
          ) : (
            <div className="ota-navbar__auth-buttons">
              <Link to="/auth">
                <Button className="ota-navbar__btn-register">Đăng ký</Button>
              </Link>
              <Link to="/auth">
                <Button className="ota-navbar__btn-login">Đăng nhập</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Product service categories */}
      <div className="ota-navbar__services-container">
        <div className="ota-navbar__services-scroll">
          {serviceTabs.map((item) => {
            const isSelected = activeTab === item.key || (item.key === 'stays' && (location.pathname === '/' || location.pathname.startsWith('/discover')));
            return item.path && !item.disabled ? (
              <Link
                key={item.key}
                to={item.path}
                className={`ota-navbar__service-item ${isSelected ? 'active' : ''}`}
              >
                <span className="ota-navbar__service-icon">{item.icon}</span>
                <span className="ota-navbar__service-label">{item.label}</span>
              </Link>
            ) : (
              <div
                key={item.key}
                className={`ota-navbar__service-item disabled`}
                title="Sắp ra mắt"
              >
                <span className="ota-navbar__service-icon">{item.icon}</span>
                <span className="ota-navbar__service-label">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

