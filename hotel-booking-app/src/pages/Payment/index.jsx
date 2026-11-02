// src/pages/Payment/index.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Button,
  Card,
  Row,
  Col,
  Form,
  Input,
  Checkbox,
  Alert,
  Radio,
  Modal,
  Result,
  Steps
} from 'antd';
import {
  SafetyCertificateOutlined,
  LockOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  QrcodeOutlined,
  ShopOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { format, isValid } from 'date-fns';
import { getHotelByID } from '../../Service/HotelService';
import { bookRoom } from '../../Service/BookRoomService';
import { QRcode } from './QRcode';
import './Payment.scss';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('vietqr');
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const bookingData = location.state?.bookingData;
  const hotelId = bookingData?.hotelId?.trim();
  const roomTypeId = bookingData?.roomId?.trim();
  const userId = localStorage.getItem('userId') || 'guest-user';
  const checkInDate = bookingData?.checkInDate;
  const checkOutDate = bookingData?.checkOutDate;
  const numberOfNights = bookingData?.numberOfNights || 1;

  // Generate unique booking confirmation code
  const bookingCode = useMemo(() => {
    return 'BK-' + Math.floor(100000 + Math.random() * 900000);
  }, []);

  // Fetch hotel details if not already passed
  useEffect(() => {
    const fetchHotel = async () => {
      if (!hotelId) return;
      try {
        const resp = await getHotelByID(hotelId);
        const data = typeof resp === 'object' && resp?.data ? resp.data : resp;
        setHotel(data);
      } catch (err) {
        console.error('Lỗi khi tải thông tin khách sạn:', err);
      }
    };
    fetchHotel();
  }, [hotelId]);

  // Pricing calculation
  const roomPricePerNight = useMemo(() => {
    if (bookingData?.pricePerNight) return bookingData.pricePerNight;
    if (hotel?.roomTypes) {
      const found = hotel.roomTypes.find((r) => String(r.id) === String(roomTypeId));
      if (found) return found.price;
    }
    return 1450000;
  }, [bookingData, hotel, roomTypeId]);

  const subTotal = roomPricePerNight * numberOfNights;
  const taxAndFee = Math.round(subTotal * 0.08); // 8% VAT
  const totalAmount = subTotal + taxAndFee;

  const formattedDate = useMemo(() => {
    if (checkInDate && checkOutDate) {
      const d1 = new Date(checkInDate);
      const d2 = new Date(checkOutDate);
      if (isValid(d1) && isValid(d2)) {
        return `${format(d1, 'dd/MM/yyyy')} — ${format(d2, 'dd/MM/yyyy')} (${numberOfNights} đêm)`;
      }
    }
    return 'Chưa xác định ngày';
  }, [checkInDate, checkOutDate, numberOfNights]);

  const handlePayment = async (values) => {
    if (!agreePolicy) {
      setError('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const payload = {
        hotelId,
        hotelName: hotel?.name || bookingData?.hotelName || 'Khách sạn',
        roomTypeId,
        roomName: bookingData?.roomName || 'Phòng tiêu chuẩn',
        checkInDate,
        checkOutDate,
        numberOfNights,
        totalPrice: totalAmount,
        paymentMethod,
        guestName: values.fullName,
        guestEmail: values.email,
        guestPhone: values.phone,
        specialRequest: values.specialRequest || '',
        bookingCode,
        status: 'CONFIRMED',
      };

      const response = await bookRoom(payload);

      // Save to localStorage for demo persistence
      try {
        const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        const newBookingRecord = {
          id: bookingCode,
          hotelName: hotel?.name || bookingData?.hotelName || 'Khách sạn',
          room: { name: bookingData?.roomName || 'Phòng tiêu chuẩn' },
          checkInDate,
          checkOutDate,
          totalPrice: totalAmount,
          status: 'CONFIRMED',
          createdAt: new Date().toISOString()
        };
        existingBookings.unshift(newBookingRecord);
        localStorage.setItem('userBookings', JSON.stringify(existingBookings));
      } catch (e) {
        console.error('Error saving local booking:', e);
      }

      setConfirmedBooking(payload);
      setIsSuccessModalVisible(true);
    } catch (err) {
      console.error('Lỗi thanh toán:', err);
      setError(err.message || 'Có lỗi xảy ra khi hoàn tất đặt phòng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="ota-payment-page">
        <header className="ota-payment-header">
          <div className="ota-payment-container header-inner">
            <Link to="/" className="logo">
              <span>HotelBooking</span>.com
            </Link>
          </div>
        </header>

        <div className="ota-payment-container empty-wrap">
          <Alert
            message="Không tìm thấy thông tin đặt phòng"
            description="Vui lòng quay lại trang danh sách hoặc chi tiết khách sạn để chọn phòng trước khi thanh toán."
            type="warning"
            showIcon
            action={
              <Button type="primary" onClick={() => navigate('/discover')}>
                Khám phá khách sạn
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="ota-payment-page">
      {/* Checkout Navbar */}
      <header className="ota-payment-header">
        <div className="ota-payment-container header-inner">
          <Link to="/" className="logo">
            <span className="brand-main">HotelBooking</span>
            <span className="brand-dot">.com</span>
          </Link>
          <div className="security-tag">
            <LockOutlined className="icon" />
            <span>Thanh toán an toàn bảo mật 256-bit SSL</span>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="ota-payment-steps">
        <div className="ota-payment-container">
          <Steps
            current={1}
            items={[
              { title: 'Chọn phòng' },
              { title: 'Thông tin & Thanh toán' },
              { title: 'Xác nhận hoàn tất' },
            ]}
          />
        </div>
      </div>

      {/* Main Checkout Section */}
      <main className="ota-payment-main">
        <div className="ota-payment-container">
          <div className="back-link">
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              style={{ padding: 0 }}
            >
              Quay lại chi tiết khách sạn
            </Button>
          </div>

          <Row gutter={[28, 28]}>
            {/* Left Column: Form & Payment Methods */}
            <Col xs={24} lg={15}>
              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  closable
                  style={{ marginBottom: 20 }}
                  onClose={() => setError('')}
                />
              )}

              {/* Guest Details Form */}
              <div className="ota-checkout-card">
                <div className="card-header">
                  <h3>1. Thông tin khách đặt phòng</h3>
                  <p>Chúng tôi sẽ gửi email xác nhận đặt phòng và mã nhận phòng vào thông tin này</p>
                </div>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handlePayment}
                  initialValues={{
                    fullName: localStorage.getItem('fullName') || '',
                    email: localStorage.getItem('email') || '',
                    phone: localStorage.getItem('phone') || '',
                  }}
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="fullName"
                        label="Họ và tên khách"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                      >
                        <Input placeholder="Ví dụ: Nguyễn Văn An" size="large" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="phone"
                        label="Số điện thoại liên hệ"
                        rules={[
                          { required: true, message: 'Vui lòng nhập số điện thoại' },
                          { pattern: /^[0-9]{9,12}$/, message: 'Số điện thoại không hợp lệ' },
                        ]}
                      >
                        <Input placeholder="Ví dụ: 0912345678" size="large" />
                      </Form.Item>
                    </Col>

                    <Col xs={24}>
                      <Form.Item
                        name="email"
                        label="Địa chỉ Email nhận xác nhận"
                        rules={[
                          { required: true, message: 'Vui lòng nhập email' },
                          { type: 'email', message: 'Địa chỉ email không hợp lệ' },
                        ]}
                      >
                        <Input placeholder="Ví dụ: nguyenvana@gmail.com" size="large" />
                      </Form.Item>
                    </Col>

                    <Col xs={24}>
                      <Form.Item
                        name="specialRequest"
                        label="Yêu cầu đặc biệt (tùy chọn)"
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder="Phòng tầng cao, giường phụ, nhận phòng sớm..."
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>

              {/* Payment Methods Selection */}
              <div className="ota-checkout-card">
                <div className="card-header">
                  <h3>2. Phương thức thanh toán</h3>
                  <p>Chọn hình thức thanh toán thuận tiện nhất cho bạn</p>
                </div>

                <div className="payment-options">
                  <Radio.Group
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="payment-radio-group"
                  >
                    <div className={`payment-method-row ${paymentMethod === 'vietqr' ? 'selected' : ''}`}>
                      <Radio value="vietqr">
                        <div className="method-label">
                          <QrcodeOutlined className="method-icon" />
                          <div>
                            <strong>Chuyển khoản VietQR tức thì (Khuyên dùng)</strong>
                            <p>Quét mã QR từ bất kỳ app ngân hàng nào (Vietcombank, MB, Techcombank, Momo...)</p>
                          </div>
                        </div>
                      </Radio>
                    </div>

                    <div className={`payment-method-row ${paymentMethod === 'card' ? 'selected' : ''}`}>
                      <Radio value="card">
                        <div className="method-label">
                          <CreditCardOutlined className="method-icon" />
                          <div>
                            <strong>Thẻ thanh toán Quốc tế</strong>
                            <p>Chấp nhận thẻ tín dụng / ghi nợ Visa, MasterCard, JCB</p>
                          </div>
                        </div>
                      </Radio>
                    </div>

                    <div className={`payment-method-row ${paymentMethod === 'hotel' ? 'selected' : ''}`}>
                      <Radio value="hotel">
                        <div className="method-label">
                          <ShopOutlined className="method-icon" />
                          <div>
                            <strong>Thanh toán tại khách sạn khi nhận phòng</strong>
                            <p>Không cần thanh toán trước, thanh toán trực tiếp tại quầy lễ tân</p>
                          </div>
                        </div>
                      </Radio>
                    </div>
                  </Radio.Group>
                </div>

                {/* Dynamic VietQR display if selected */}
                {paymentMethod === 'vietqr' && (
                  <div className="vietqr-container">
                    <QRcode price={totalAmount} bookingCode={bookingCode} />
                  </div>
                )}

                {/* Credit card form teaser if selected */}
                {paymentMethod === 'card' && (
                  <div className="card-input-box">
                    <Row gutter={12}>
                      <Col xs={24}>
                        <Input placeholder="Số thẻ: 4xxx xxxx xxxx xxxx" size="large" style={{ marginBottom: 12 }} />
                      </Col>
                      <Col xs={12}>
                        <Input placeholder="MM/YY" size="large" />
                      </Col>
                      <Col xs={12}>
                        <Input placeholder="CVV / CVC" size="large" />
                      </Col>
                    </Row>
                  </div>
                )}
              </div>

              {/* Terms and Submit */}
              <div className="ota-checkout-card terms-card">
                <Checkbox
                  checked={agreePolicy}
                  onChange={(e) => setAgreePolicy(e.target.checked)}
                >
                  Tôi đã đọc và đồng ý với{' '}
                  <a href="/terms" target="_blank" rel="noreferrer">
                    Điều khoản dịch vụ
                  </a>{' '}
                  và{' '}
                  <a href="/privacy" target="_blank" rel="noreferrer">
                    Chính sách bảo mật
                  </a>{' '}
                  của HotelBooking.com.
                </Checkbox>

                <div className="submit-action-wrap">
                  <Button
                    type="primary"
                    size="large"
                    className="ota-confirm-booking-btn"
                    loading={isLoading}
                    disabled={isLoading || !agreePolicy}
                    onClick={() => form.submit()}
                  >
                    {isLoading ? 'Đang xử lý...' : 'Xác nhận hoàn tất đặt phòng'}
                  </Button>
                </div>
              </div>
            </Col>

            {/* Right Column: Reservation Summary Card */}
            <Col xs={24} lg={9}>
              <div className="ota-summary-card">
                <div className="summary-hotel-header">
                  {hotel?.images?.[0]?.imageUrl || hotel?.thumbnailUrl ? (
                    <img
                      src={hotel?.images?.[0]?.imageUrl || hotel?.thumbnailUrl}
                      alt={hotel?.name}
                      className="hotel-thumb"
                    />
                  ) : null}
                  <div>
                    <h3 className="hotel-name">{hotel?.name || bookingData?.hotelName}</h3>
                    <div className="hotel-address">
                      <EnvironmentOutlined /> {hotel?.address || bookingData?.hotelAddress}
                    </div>
                  </div>
                </div>

                <div className="summary-stay-details">
                  <h4>Chi tiết kỳ nghỉ của bạn</h4>
                  <div className="stay-row">
                    <span className="stay-label">Thời gian lưu trú:</span>
                    <strong className="stay-val">{formattedDate}</strong>
                  </div>
                  <div className="stay-row">
                    <span className="stay-label">Loại chỗ nghỉ:</span>
                    <strong className="stay-val">{bookingData?.roomName || 'Phòng Deluxe'}</strong>
                  </div>
                  <div className="stay-row">
                    <span className="stay-label">Giờ nhận phòng:</span>
                    <strong className="stay-val">Từ {hotel?.checkInTime || '14:00'}</strong>
                  </div>
                  <div className="stay-row">
                    <span className="stay-label">Giờ trả phòng:</span>
                    <strong className="stay-val">Trước {hotel?.checkOutTime || '12:00'}</strong>
                  </div>
                </div>

                <div className="summary-price-breakdown">
                  <h4>Tóm tắt giá</h4>
                  <div className="price-row">
                    <span>
                      Giá phòng ({numberOfNights} đêm x {roomPricePerNight.toLocaleString('vi-VN')}₫):
                    </span>
                    <span>{subTotal.toLocaleString('vi-VN')} VND</span>
                  </div>
                  <div className="price-row">
                    <span>Thuế GTGT & phí dịch vụ (8%):</span>
                    <span>{taxAndFee.toLocaleString('vi-VN')} VND</span>
                  </div>
                  <div className="price-row total-row">
                    <span>Tổng tiền thanh toán:</span>
                    <span className="total-amount">{totalAmount.toLocaleString('vi-VN')} VND</span>
                  </div>
                  <span className="tax-badge">Đã bao gồm toàn bộ thuế và phí</span>
                </div>

                <div className="summary-benefits">
                  <div className="benefit">
                    <CheckCircleOutlined className="icon" /> Miễn phí hủy phòng trước 48h
                  </div>
                  <div className="benefit">
                    <CheckCircleOutlined className="icon" /> Xác nhận tức thì qua email
                  </div>
                  <div className="benefit">
                    <SafetyCertificateOutlined className="icon" /> Không tính phí ẩn
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </main>

      {/* Confirmation Success Modal */}
      <Modal
        open={isSuccessModalVisible}
        footer={null}
        closable={false}
        width={560}
        centered
      >
        <Result
          status="success"
          title="Đặt phòng thành công!"
          subTitle={`Mã đặt phòng của bạn là ${bookingCode}. Chúng tôi đã gửi thông tin xác nhận qua email của bạn.`}
          extra={[
            <Button
              type="primary"
              key="bookings"
              onClick={() => navigate('/profile')}
            >
              Xem đơn đặt phòng của tôi
            </Button>,
            <Button
              key="home"
              onClick={() => navigate('/')}
            >
              Về trang chủ
            </Button>,
          ]}
        />
      </Modal>

      <footer className="ota-payment-footer">
        <div className="ota-payment-container">
          <p>© 2026 HotelBooking.com. Dịch vụ đặt phòng khách sạn trực tuyến an toàn và tiện lợi.</p>
        </div>
      </footer>
    </div>
  );
}
