import { Button, Col, Row } from 'antd';
import './grid.scss';
import MultiLine from '../MultiLine';
import DemoRadar from '../Radar';
import { useState, useEffect } from 'react';
import { getBookings } from '../../Service/DashboardService';
import BookingTable from '../BookingTable';
import { exportBookingsToExcel } from '../ExportBookingsToExcel';

const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="stats-card col">
      <div className="stats-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
};

const AdditionalStats = ({ bookings }) => {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="additional-stats col box-11">
        <h3>Thống kê bổ sung</h3>
        <p>Tỷ lệ hủy phòng: 0 %</p>
        <p>Tỷ lệ chiếm dụng: 0 %</p>
        <p>Tỷ lệ thành công: 0 %</p>
        <p>Tỷ lệ đang chờ xử lý: 0 %</p>
      </div>
    );
  }

  const total = bookings.length;
  const cancelled = bookings.filter(b => b.status?.toLowerCase() === 'cancelled').length;
  const confirmed = bookings.filter(b => b.status?.toLowerCase() === 'active').length;
  const pending = bookings.filter(b => b.status?.toLowerCase() === 'pending').length;

  const calculateRate = (count) => ((count / total) * 100).toFixed(1);

  const cancelRate = calculateRate(cancelled);
  const occupancyRate = calculateRate(confirmed);
  const pendingRate = calculateRate(pending);
  const successRate = occupancyRate; // logic tạm thời

  return (
    <div className="additional-stats col box-11">
      <h3>Thống kê bổ sung</h3>
      <Row gutter={[20]}>
        <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
          <h3>Tỷ lệ hủy phòng: {cancelRate} %</h3>
        </Col>
        <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
          <h3>Tỷ lệ chiếm dụng: {occupancyRate} %</h3>
        </Col>
        <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
          <h3>Tỷ lệ thành công: {successRate} %</h3>
        </Col>
        <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
          <h3>Tỷ lệ đang chờ xử lý: {pendingRate} %</h3>
        </Col>
      </Row>
    </div>
  );
};

function Grid() {
  const [data, setData] = useState([]); // mảng rỗng
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getBookings();
        setData(response.data || []); // lấy trực tiếp response.data
        console.log(response.data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="dashboard">
      <main className="dashboard-main">
        <Row gutter={[20, 25]}>
          <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
            <StatsCard title="Tổng đặt phòng" value={data.length} icon="📋" />
          </Col>
          <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
            <StatsCard title="Doanh thu" value={`${(data.reduce((sum, b) => sum + b.totalPrice, 0)).toLocaleString('vi-VN')} VND`} icon="💰" />
          </Col>
          <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
            <StatsCard title="Khách hàng mới" value={data.length} icon="👥" />
          </Col>
          <Col xxl={16} xl={16} lg={16} md={24} sm={24} xs={24}>
            <div className="col box-5">
              <MultiLine data={data} />
            </div>
          </Col>
          <Col xxl={8} xl={8} lg={8} md={24} sm={24} xs={24}>
            <div className="col box-6">
              <DemoRadar data={data} />
            </div>
          </Col>
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            <BookingTable bookings={data} />
          </Col>
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            <AdditionalStats bookings={data} />
          </Col>
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            <Button type='primary' size='large' onClick={() => exportBookingsToExcel(data)}>
              <h3>Xuất báo cáo đặt phòng</h3>
            </Button>
            <span>(File Excel)</span>
          </Col>
        </Row>
      </main>
    </div>
  );
}

export default Grid;
