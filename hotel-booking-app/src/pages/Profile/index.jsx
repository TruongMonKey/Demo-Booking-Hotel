// src/pages/Profile/index.jsx
import React, { useEffect, useState } from 'react';
import {
  Card,
  Avatar,
  Button,
  Typography,
  Space,
  Table,
  Tag,
  Tabs,
  Breadcrumb,
  Empty
} from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CrownOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getUserById } from '../../Service/UserServices';
import './Profile.scss';

const { Title, Text } = Typography;

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId')?.trim();

      // Read local bookings
      const localBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');

      if (userId) {
        try {
          const res = await getUserById(userId);
          const userData = res?.user || res?.data || res;
          if (userData && (userData.name || userData.email)) {
            setUser(userData);
            const serverBookings = (userData.bookings || []).map((b) => ({
              ...b,
              key: b.id,
            }));
            // Combine server & local bookings
            setBookings([...localBookings, ...serverBookings]);
            return;
          }
        } catch (err) {
          console.warn('Lỗi khi tải thông tin user từ backend:', err);
        }
      }

      // Fallback user from localStorage
      setUser({
        name: localStorage.getItem('fullName') || 'Khách hàng thân thiết',
        email: localStorage.getItem('email') || 'khachhang@hotelbooking.com',
        phoneNumber: localStorage.getItem('phone') || '0988 888 999',
      });
      setBookings(localBookings);
    };

    fetchUserData();
  }, []);

  const bookingColumns = [
    {
      title: 'Mã đặt phòng',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <strong style={{ color: '#006ce4' }}>{id || 'BK-892147'}</strong>,
    },
    {
      title: 'Khách sạn / Chỗ nghỉ',
      key: 'hotelName',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>
            {record.hotelName || record.hotel?.name || 'TMS Hotel Da Nang Beach'}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {record.room?.name || record.roomName || 'Phòng Deluxe Tiêu Chuẩn'}
          </div>
        </div>
      ),
    },
    {
      title: 'Ngày nhận phòng',
      dataIndex: 'checkInDate',
      key: 'checkInDate',
      render: (date) => (
        <span>
          <CalendarOutlined style={{ marginRight: 6, color: '#006ce4' }} />
          {date || '2026-11-10'}
        </span>
      ),
    },
    {
      title: 'Ngày trả phòng',
      dataIndex: 'checkOutDate',
      key: 'checkOutDate',
      render: (date) => (
        <span>
          <CalendarOutlined style={{ marginRight: 6, color: '#64748b' }} />
          {date || '2026-11-12'}
        </span>
      ),
    },
    {
      title: 'Tổng tiền',
      key: 'price',
      render: (_, record) => (
        <strong style={{ color: '#008009' }}>
          {record.totalPrice
            ? `${Number(record.totalPrice).toLocaleString('vi-VN')} VND`
            : '2.900.000 VND'}
        </strong>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        let text = 'Đã xác nhận';
        const lower = String(status || '').toLowerCase();

        if (lower === 'pending') {
          color = 'orange';
          text = 'Chờ xử lý';
        } else if (lower.includes('cancel')) {
          color = 'red';
          text = 'Đã hủy';
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  const tabItems = [
    {
      key: 'bookings',
      label: 'Đơn đặt phòng của tôi',
      children: (
        <div className="ota-profile-tab-content">
          <div className="tab-header">
            <h3>Danh sách các kỳ nghỉ đã đặt</h3>
            <p>Quản lý và xem lại thông tin chi tiết các phòng bạn đã đặt qua HotelBooking.com</p>
          </div>

          {bookings.length > 0 ? (
            <Table
              dataSource={bookings}
              columns={bookingColumns}
              rowKey={(r) => r.id || Math.random()}
              pagination={{ pageSize: 5 }}
            />
          ) : (
            <Empty
              description="Bạn chưa có đơn đặt phòng nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Link to="/discover">
                <Button type="primary">Khám phá và đặt phòng ngay</Button>
              </Link>
            </Empty>
          )}
        </div>
      ),
    },
    {
      key: 'genius',
      label: 'Ưu đãi thành viên Genius',
      children: (
        <div className="ota-profile-tab-content">
          <div className="genius-promo-box">
            <CrownOutlined className="crown-icon" />
            <div>
              <h3>Cấp độ thành viên: Genius Cấp 2</h3>
              <p>Bạn được giảm ngay 10% - 15% cho mỗi đặt phòng và nhận bữa sáng miễn phí tại các khách sạn tham gia.</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="ota-profile-page">
      <Navbar />

      <main className="ota-profile-main">
        <div className="ota-profile-container">
          <div className="ota-profile-breadcrumb">
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
                  title: 'Tài khoản của tôi',
                },
              ]}
            />
          </div>

          <Card className="ota-profile-card">
            <div className="ota-profile-header">
              <Avatar
                size={84}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#003580', fontSize: '36px' }}
              />
              <div className="ota-profile-info">
                <div className="name-row">
                  <Title level={3} style={{ margin: 0 }}>
                    {user?.name || localStorage.getItem('fullName') || 'Khách hàng'}
                  </Title>
                  <Tag color="gold" icon={<CrownOutlined />}>
                    Genius Cấp 2
                  </Tag>
                </div>

                <Space direction="horizontal" size="large" style={{ marginTop: 8, flexWrap: 'wrap' }}>
                  <Text>
                    <MailOutlined style={{ color: '#006ce4', marginRight: 6 }} />
                    {user?.email || localStorage.getItem('email') || 'Chưa có email'}
                  </Text>
                  <Text>
                    <PhoneOutlined style={{ color: '#006ce4', marginRight: 6 }} />
                    {user?.phoneNumber || localStorage.getItem('phone') || 'Chưa có số điện thoại'}
                  </Text>
                </Space>
              </div>
            </div>

            <div className="ota-profile-tabs">
              <Tabs defaultActiveKey="bookings" items={tabItems} />
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
