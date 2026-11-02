import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button, message } from 'antd';
import {
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
  ThunderboltOutlined,
  DollarOutlined,
  MailOutlined
} from '@ant-design/icons';
import './Footer.scss';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      message.error('Vui lòng nhập địa chỉ email hợp lệ!');
      return;
    }
    message.success('Cảm ơn bạn đã đăng ký nhận bản tin ưu đãi từ HotelBooking.com!');
    setEmail('');
  };

  return (
    <footer className="ota-footer">
      {/* Value props banner */}
      <div className="ota-footer__trust-strip">
        <div className="ota-footer__container">
          <div className="ota-footer__trust-grid">
            <div className="ota-footer__trust-item">
              <SafetyCertificateOutlined className="ota-footer__trust-icon" />
              <div>
                <h4>Đảm bảo giá tốt nhất</h4>
                <p>Không lo về giá, luôn có ưu đãi độc quyền mỗi ngày</p>
              </div>
            </div>
            <div className="ota-footer__trust-item">
              <CustomerServiceOutlined className="ota-footer__trust-icon" />
              <div>
                <h4>Hỗ trợ khách hàng 24/7</h4>
                <p>Đội ngũ chuyên viên sẵn sàng hỗ trợ bất cứ lúc nào</p>
              </div>
            </div>
            <div className="ota-footer__trust-item">
              <ThunderboltOutlined className="ota-footer__trust-icon" />
              <div>
                <h4>Xác nhận tức thì</h4>
                <p>Đặt phòng nhanh chóng chỉ trong vài thao tác</p>
              </div>
            </div>
            <div className="ota-footer__trust-item">
              <DollarOutlined className="ota-footer__trust-icon" />
              <div>
                <h4>Miễn phí hủy phòng</h4>
                <p>Linh hoạt thay đổi lịch trình ở hầu hết các khách sạn</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter subscribe */}
      <div className="ota-footer__newsletter">
        <div className="ota-footer__container">
          <div className="ota-footer__newsletter-content">
            <div className="ota-footer__newsletter-text">
              <h3>Tiết kiệm thời gian, tiết kiệm tiền!</h3>
              <p>Hãy đăng ký để nhận các ưu đãi khách sạn bí mật giảm tới 30%</p>
            </div>
            <form onSubmit={handleSubscribe} className="ota-footer__newsletter-form">
              <Input
                prefix={<MailOutlined style={{ color: '#999' }} />}
                placeholder="Nhập địa chỉ email của bạn..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ota-footer__newsletter-input"
              />
              <Button type="primary" htmlType="submit" className="ota-footer__newsletter-btn">
                Đăng ký
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main navigation links */}
      <div className="ota-footer__links-section">
        <div className="ota-footer__container">
          <div className="ota-footer__links-grid">
            <div className="ota-footer__col">
              <h4>Về HotelBooking.com</h4>
              <ul>
                <li><Link to="/">Giới thiệu về chúng tôi</Link></li>
                <li><Link to="/">Cách thức hoạt động</Link></li>
                <li><Link to="/">Cơ hội nghề nghiệp</Link></li>
                <li><Link to="/">Truyền thông & Báo chí</Link></li>
                <li><Link to="/">Quan hệ nhà đầu tư</Link></li>
              </ul>
            </div>

            <div className="ota-footer__col">
              <h4>Khám phá điểm đến</h4>
              <ul>
                <li><Link to="/discover?keyword=Hà Nội">Khách sạn Hà Nội</Link></li>
                <li><Link to="/discover?keyword=Đà Nẵng">Khách sạn Đà Nẵng</Link></li>
                <li><Link to="/discover?keyword=TP. Hồ Chí Minh">Khách sạn TP. Hồ Chí Minh</Link></li>
                <li><Link to="/discover?keyword=Phú Quốc">Khách sạn Phú Quốc</Link></li>
                <li><Link to="/discover?keyword=Nha Trang">Khách sạn Nha Trang</Link></li>
                <li><Link to="/discover?keyword=Đà Lạt">Khách sạn Đà Lạt</Link></li>
              </ul>
            </div>

            <div className="ota-footer__col">
              <h4>Hỗ trợ & Điều khoản</h4>
              <ul>
                <li><Link to="/">Trung tâm trợ giúp</Link></li>
                <li><Link to="/">Hướng dẫn đặt chỗ</Link></li>
                <li><Link to="/">Chính sách bảo mật</Link></li>
                <li><Link to="/">Điều khoản sử dụng</Link></li>
                <li><Link to="/">Khiếu nại & Giải quyết</Link></li>
              </ul>
            </div>

            <div className="ota-footer__col">
              <h4>Dành cho đối tác</h4>
              <ul>
                <li><Link to="/admin">Đăng chỗ nghỉ của bạn</Link></li>
                <li><Link to="/admin">Cổng Extranet đối tác</Link></li>
                <li><Link to="/">Chương trình đối tác liên kết</Link></li>
                <li><Link to="/">Hợp tác phân phối OTA</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Payment methods and bottom copyright */}
      <div className="ota-footer__bottom">
        <div className="ota-footer__container">
          <div className="ota-footer__payment-methods">
            <span className="ota-footer__payment-label">Phương thức thanh toán chấp nhận:</span>
            <div className="ota-footer__badges">
              <span className="badge">VietQR</span>
              <span className="badge">Visa</span>
              <span className="badge">Mastercard</span>
              <span className="badge">JCB</span>
              <span className="badge">MoMo</span>
              <span className="badge">ZaloPay</span>
              <span className="badge">Napas</span>
            </div>
          </div>

          <div className="ota-footer__copyright">
            <p>
              HotelBooking.com là nền tảng đại lý du lịch trực tuyến (OTA) cung cấp dịch vụ đặt phòng khách sạn, căn hộ và resort hàng đầu tại Việt Nam.
            </p>
            <p className="sub">
              Bản quyền © 2026 HotelBooking.com. Bảo lưu mọi quyền.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

