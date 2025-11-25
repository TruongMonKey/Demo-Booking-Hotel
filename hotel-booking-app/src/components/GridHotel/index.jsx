// src/components/GridHotel/GridHotel.jsx
import { Badge, Button, Card, Col, Row, Pagination } from "antd";
import { CheckOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useState, useMemo, useCallback, useEffect } from 'react';
import StarRating from "../../components/StarRating";
import './GridHotel.scss';

function GridHotel(props) {
  /** 
   * RAW có thể là:
   * 1) [ {hotel1}, {hotel2} ]
   * 2) { statusCode, message, data: [ {hotel1}, {hotel2} ] }
   */
  const { data: raw = [], showPagination = true, defaultPageSize = 8 } = props;

  // Chuẩn hóa về array hotels
  const data = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);

  // Debug để xem dữ liệu vào
  console.debug("[GridHotel] normalized data:", data);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Reset trang khi data thay đổi
  useEffect(() => {
    if (!showPagination) return;
    setCurrentPage(1);
  }, [data, showPagination]);

  // Tính toán dữ liệu trang hiện tại
  const currentPageData = useMemo(() => {
    if (!showPagination) return data;

    const startIdx = (currentPage - 1) * pageSize;
    return data.slice(startIdx, startIdx + pageSize);
  }, [data, currentPage, pageSize, showPagination]);

  const handlePageChange = useCallback((page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Row gutter={[20, 20]} className="grid-hotel">
        {currentPageData.map((item, idx) => {
          const img = item?.images?.[0]?.imageUrl || "/placeholder.png";
          const price = item?.roomTypes?.[0]?.price;

          return (
            <Col xxl={6} xl={6} lg={6} md={8} sm={24} span={24} key={item?.id ?? idx}>
              <Badge.Ribbon
                text={(item?.rate ?? 0) >= 4.5 ? "Tốt" : "Trung bình"}
                color={(item?.rate ?? 0) >= 4.5 ? "purple" : "blue"}
              >
                <Card className="card-item" title={item?.name ?? "—"} variant="borderless">
                  <Row gutter={[20, 20]}>
                    <Col span={24}>
                      <div className="image">
                        <img src={img} alt="ảnh khách sạn" />
                      </div>
                    </Col>

                    <Col span={24}>
                      <div className="content">
                        <h2 className="title">{item?.name ?? "Tên trống"}</h2>
                        <div className="address">{item?.address ?? "—"}</div>

                        {item?.linkMap && (
                          <a href={item.linkMap} className="link-map" target="_blank" rel="noreferrer">
                            Xem bản đồ
                          </a>
                        )}

                        <div className="cancel">
                          {item?.cancel && (
                            <>
                              <CheckOutlined /> Miễn phí hủy
                            </>
                          )}
                        </div>

                        <div className="deposit">
                          {!item?.deposit && (
                            <>
                              <CheckOutlined /> Không cọc trước, không thanh toán trước
                            </>
                          )}
                        </div>

                        <div className="rate">
                          <StarRating rate={item?.rate ?? 0} />
                        </div>
                      </div>
                    </Col>

                    <Col span={24} className="card-price">
                      <div className="card-price__item">
                        <p className="desc">1 đêm, 2 người lớn</p>

                        <strong className="price">
                          {price
                            ? `${Number(price).toLocaleString("vi-VN")} VND`
                            : "Thỏa thuận"}
                        </strong>

                        <p className="desc">Đã bao gồm thuế và phí</p>

                        <Button type="primary">
                          <Link to={`discover/detail/${item?.id}`}>
                            Xem chỗ trống <RightOutlined />
                          </Link>
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Badge.Ribbon>
            </Col>
          );
        })}
      </Row>

      {/* Pagination */}
      {showPagination && data.length > pageSize && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 40, marginBottom: 20 }}>
          <Pagination
            current={currentPage}
            total={data.length}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            pageSizeOptions={['4', '8', '12', '16', '20']}
            showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} khách sạn`}
            responsive
          />
        </div>
      )}

      {/* Không có dữ liệu */}
      {data.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "#999"
        }}>
          <h3>Không có khách sạn nào để hiển thị</h3>
          <p>Vui lòng thử lại sau hoặc kiểm tra kết nối mạng</p>
        </div>
      )}
    </>
  );
}

export default GridHotel;
