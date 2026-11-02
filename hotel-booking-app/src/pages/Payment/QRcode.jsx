import React from 'react';
import { Typography, Alert } from 'antd';
import { QrcodeOutlined, CheckCircleOutlined, CopyOutlined } from '@ant-design/icons';
import { message } from 'antd';

const { Text } = Typography;

export function QRcode({ price = 0, bookingCode = 'BK-DEMO' }) {
  const amount = typeof price === 'number' ? price : parseInt(price, 10) || 1200000;
  // VietQR standard URL
  const qrUrl = `https://img.vietqr.io/image/970422-0988889999-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(bookingCode)}&accountName=HOTELBOOKING%20OTA`;

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    message.success('Đã sao chép vào bộ nhớ tạm!');
  };

  return (
    <div className="ota-vietqr-box">
      <div className="ota-vietqr-header">
        <QrcodeOutlined className="icon" />
        <div>
          <h4>Quét mã VietQR để thanh toán</h4>
          <p>Mở ứng dụng ngân hàng hoặc ví điện tử bất kỳ để quét mã</p>
        </div>
      </div>

      <div className="ota-vietqr-body">
        <div className="qr-image-wrap">
          <img
            src={qrUrl}
            alt="Mã QR thanh toán VietQR"
            onError={(e) => {
              // Fallback to local image or generated visual
              e.target.onerror = null;
              e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(`PAY:${bookingCode}:${amount}`);
            }}
          />
        </div>

        <div className="bank-details-card">
          <div className="detail-row">
            <span className="label">Ngân hàng:</span>
            <span className="value">MB Bank (Quân Đội)</span>
          </div>
          <div className="detail-row">
            <span className="label">Chủ tài khoản:</span>
            <span className="value">HOTELBOOKING OTA VIETNAM</span>
          </div>
          <div className="detail-row">
            <span className="label">Số tài khoản:</span>
            <span className="value highlight" onClick={() => copyToClipboard('0988889999')}>
              0988889999 <CopyOutlined className="copy-icon" />
            </span>
          </div>
          <div className="detail-row">
            <span className="label">Số tiền:</span>
            <span className="value price">{amount.toLocaleString('vi-VN')} VND</span>
          </div>
          <div className="detail-row">
            <span className="label">Nội dung CK:</span>
            <span className="value highlight" onClick={() => copyToClipboard(bookingCode)}>
              {bookingCode} <CopyOutlined className="copy-icon" />
            </span>
          </div>
        </div>
      </div>

      <Alert
        message="Hệ thống tự động kích hoạt xác nhận đặt phòng ngay sau khi nhận được thanh toán trong vòng 1-3 phút."
        type="info"
        showIcon
        style={{ marginTop: 14 }}
      />
    </div>
  );
}
