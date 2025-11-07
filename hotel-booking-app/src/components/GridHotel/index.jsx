import { Badge, Button, Card, Col, Row, Pagination } from "antd";
import { CheckOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useState, useMemo, useCallback } from 'react';
import StarRating from "../../components/StarRating";
import './GridHotel.scss'

function GridHotel(props) {
  const { data, showPagination = true, defaultPageSize = 8 } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const currentPageData = useMemo(() => {
    if (!showPagination) return data;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data?.slice(startIndex, endIndex) || [];
  }, [data, currentPage, pageSize, showPagination]);

  // Xử lý thay đổi trang
  const handlePageChange = useCallback((page, size) => {
    setCurrentPage(page);
    setPageSize(size);

    // Scroll to top khi chuyển trang
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Reset về trang 1 khi data thay đổi
  useMemo(() => {
    if (data && showPagination) {
      const maxPage = Math.ceil(data.length / pageSize);
      if (currentPage > maxPage && maxPage > 0) {
        setCurrentPage(1);
      }
    }
  }, [data, pageSize, currentPage, showPagination]);

  return (
    <>
      <Row gutter={[20, 20]} className="grid-hotel">
        {currentPageData && currentPageData.map((item) => (
          <Col xxl={6} xl={6} lg={6} md={8} sm={24} span={24} key={item.id}>
            <Badge.Ribbon text={item.rate >= 4.5 ? "Tốt" : "Trung bình"} color={item.rate >= 4.5 ? "purple" : "blue"}>
              <Card className="card-item" title={item.name} variant="borderless">
                <Row gutter={[20, 20]}>
                  <Col span={24}>
                    <div className="image">
                      <img src={item?.images[0]?.imageUrl || ""} alt="ảnh khách sạn" />
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className="content">
                      <h2 className="title">{item.name}</h2>
                      <div className="address">{item.address}</div>
                      <a href={item.linkMap} className="link-map" target="_blank" rel="noreferrer">Xem bản đồ</a>
                      {/* <p className="description">{item.description}</p> */}
                      <div className="cancel">
                        {item.cancel ? (
                          <>
                            <CheckOutlined /> Miễn phí hủy
                          </>
                        ) : (<></>)}
                      </div>
                      <div className="deposit">
                        {!item.deposit ? (
                          <>
                            <CheckOutlined /> Không cọc trước, không thanh toán trước
                          </>
                        ) : (<></>)}
                      </div>
                      <div className="rate"><StarRating rate={item.rate} /></div>
                      {/* <div className="quantity-review">{(item.reviews).length} người đã đánh giá</div> */}
                    </div>
                  </Col>
                  <Col span={24} className="card-price">
                    <div className="card-price__item">
                      <p className="desc">1 đêm, 2 người lớn</p>
                      <strong className="price">
                        {item.roomTypes && item.roomTypes.length > 0 && item.roomTypes[0]?.price
                          ? `${item.roomTypes[0].price.toLocaleString("vi-VN")} VND`
                          : "Thỏa thuận"}
                      </strong>
                      <p className="desc">Đã bao gồm thuế và phí</p>
                      <Button type="primary">
                        <Link to={`discover/detail/${item.id}`}>Xem chỗ trống <RightOutlined /></Link>
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>

      {/* Pagination Component */}
      {showPagination && data && data.length > pageSize && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '40px',
          marginBottom: '20px'
        }}>
          <Pagination
            current={currentPage}
            total={data.length}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={true}
            showQuickJumper={true}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} khách sạn`
            }
            pageSizeOptions={['4', '8', '12', '16', '20']}
            locale={{
              items_per_page: '/ trang',
              jump_to: 'Đến trang',
              jump_to_confirm: 'xác nhận',
              page: '',
              prev_page: 'Trang trước',
              next_page: 'Trang sau',
              prev_5: '5 trang trước',
              next_5: '5 trang sau',
              prev_3: '3 trang trước',
              next_3: '3 trang sau'
            }}
            responsive={true}
          />
        </div>
      )}

      {/* Thông báo không có dữ liệu */}
      {(!data || data.length === 0) && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#999'
        }}>
          <h3>Không có khách sạn nào để hiển thị</h3>
          <p>Vui lòng thử lại sau hoặc kiểm tra kết nối mạng</p>
        </div>
      )}
    </>
  );
}

export default GridHotel;