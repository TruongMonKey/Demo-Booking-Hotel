import React from 'react';
import { Col, Row, Tabs } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import image from '../../image/Login.jpg';
import './LoginPage.scss';
import Login from './Login';
import Register from './Register';

function LoginPage() {
  const items = [
    {
      key: 'login',
      label: 'Đăng nhập',
      children: <Login />,
    },
    {
      key: 'register',
      label: 'Đăng ký',
      children: <Register />,
    },
  ];

  return (
    <Row className="login-page">
      <Col className="login-page__left" xxl={15} xl={15} lg={14} md={0} sm={0} span={0}>
        <img src={image} alt="ảnh đăng nhập HotelBooking" />
        <div className="content">
          <Link to="/" className="brand">
            HotelBooking<span>.com</span>
          </Link>
          <h2>Kết nối giá trị — Trải nghiệm tinh hoa du lịch</h2>
          <p>
            Đăng nhập tài khoản HotelBooking.com để lưu giữ kỳ nghỉ yêu thích, quản lý đơn đặt phòng và nhận ưu đãi giảm giá thành viên Genius độc quyền.
          </p>
        </div>
      </Col>

      <Col className="login-page__right" xxl={9} xl={9} lg={10} md={24} sm={24} span={24}>
        <div style={{ width: '100%', maxWidth: 380, marginBottom: 16 }}>
          <Link to="/" style={{ color: '#006ce4', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeftOutlined /> Quay lại Trang chủ
          </Link>
        </div>

        <Tabs
          defaultActiveKey="login"
          items={items}
          tabBarStyle={{
            display: 'flex',
            justifyContent: 'center',
          }}
        />
      </Col>
    </Row>
  );
}

export default LoginPage;
