import { Button, Col, Layout, Row, Pagination } from "antd";
import { Link, Outlet, useLocation, useParams } from "react-router";
import "./Discover.scss";
import { Content, Footer } from "antd/es/layout/layout";
import { useEffect, useState, useCallback, useMemo } from "react";
import { getHotels } from "../../Service/HotelService";
import ListHotel from "./ListHotel";
import HotelSearch from "../../components/Search";
import TopMenu from "../../components/TopMenu";
import RatingFilter from "../../components/RatingFilter";


function capitalizeWords(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}



function Discover() {
  const [hotels, setHotels] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [keywordFromURL, setKeywordFromURL] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Số hotel hiển thị mỗi trang

  const location = useLocation();
  const param = useParams()

  const token = localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    localStorage.removeItem("phone");
    localStorage.removeItem("role");
    localStorage.removeItem("userId")
  }

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await getHotels();
        setHotels(response.hotelList);
        
      } catch (error) {
        console.error("Lỗi khi tải danh sách khách sạn:", error);
      }
    };
    fetchAPI();
  }, [param]);

  // Lọc khách sạn theo từ khóa & số sao
  const filteredHotels = useMemo(() => {
    let result = hotels;
    const searchKey = keywordFromURL.trim().toLowerCase();

    if (searchKey) {
      result = result.filter(
        (hotel) =>
          hotel?.name?.toLowerCase().includes(searchKey) ||
          hotel?.address?.toLowerCase().includes(searchKey)
      );
    }

    if (selectedRatings.length > 0) {
      result = result.filter((hotel) => selectedRatings.includes(Math.floor(hotel.rate)));
    }

    return result;
  }, [hotels, keywordFromURL, selectedRatings]);

  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredHotels.slice(startIndex, endIndex);
  }, [filteredHotels, currentPage, pageSize]);

  // Xử lý tìm kiếm và cập nhật keywordFromURL
  const handleSearch = useCallback(({ keyword }) => {
    setKeywordFromURL(keyword); // Cập nhật keyword ngay lập tức
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm mới
    const newParams = new URLSearchParams(location.search);
    if (keyword) {
      newParams.set("keyword", keyword);
    } else {
      newParams.delete("keyword");
    }
    window.history.replaceState(null, "", `?${newParams.toString()}`);
  }, [location.search]);

  // Cập nhật bộ lọc số sao
  const handleFilter = useCallback((ratings) => {
    setSelectedRatings(ratings);
    setCurrentPage(1); // Reset về trang đầu khi thay đổi filter
  }, []);

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keyword = params.get("keyword") || "";
    setKeywordFromURL(keyword);
  }, [location.search]);

  // Reset trang khi filteredHotels thay đổi
  useEffect(() => {
    if (currentPage > Math.ceil(filteredHotels.length / pageSize)) {
      setCurrentPage(1);
    }
  }, [filteredHotels.length, pageSize, currentPage]);

  return (
    <Layout className="layout-home">
      <header>
        <div className="layout-home__header">
          <div className="logo">
            <Link to="/">HotelBooking.com</Link>
          </div>
          <div className="option">
            <div className="language">
              <img
                src="https://t-cf.bstatic.com/design-assets/assets/v3.142.0/images-flags/Vn@3x.png"
                alt="Tiếng Việt"
              />
            </div>
            <Row className="login/logout" gutter={20}>
              <Col span={24}>
                {token ? (
                  <>
                    <Button className="login" onClick={handleLogout}>
                      <Link>Đăng xuất</Link>
                    </Button>
                    {token ? (
                      <Link to="/profile" style={{marginLeft: "10px", color: "#fff", fontWeight: "500", }}>{capitalizeWords(localStorage.getItem("fullName"))}</Link>
                    )
                      :
                      (
                        <></>
                      )
                    }
                  </>
                ) : (
                  <>
                    <Button className="login">
                      <Link to={"/auth"}>Đăng nhập</Link>
                    </Button>
                  </>
                )}
              </Col>
            </Row>
          </div>
        </div>
        <div className="menu">
          <TopMenu />
        </div>
        <div className="search">
          <HotelSearch onSearch={handleSearch} defaultKeyword={keywordFromURL} />
        </div>
      </header>

      <Content className="layout-home__content">
        {param.id ? (
          <><Outlet /></>
        ) : (
          <>
            <Row gutter={20}>
              <Col span={5} className="filter">
                <h2>Chọn lọc theo:</h2>
                <RatingFilter onFilter={handleFilter} />
              </Col>
              <Col span={19}>
                <div>
                  {/* Hiển thị thông tin tổng quan */}
                  <div style={{
                    marginBottom: '16px',
                    fontSize: '14px',
                    color: '#666',
                    textAlign: 'right'
                  }}>
                    Tìm thấy {filteredHotels.length} khách sạn
                    {keywordFromURL && (
                      <span> cho từ khóa "<strong>{keywordFromURL}</strong>"</span>
                    )}
                  </div>

                  {/* Danh sách khách sạn */}
                  <ListHotel data={currentPageData} />

                  {/* Pagination */}
                  {filteredHotels.length > 0 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '32px',
                      marginBottom: '20px'
                    }}>
                      <Pagination
                        current={currentPage}
                        total={filteredHotels.length}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        showSizeChanger={true}
                        showQuickJumper={true}
                        showTotal={(total, range) =>
                          `${range[0]}-${range[1]} của ${total} khách sạn`
                        }
                        pageSizeOptions={['5', '10', '15', '20']}
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
                      />
                    </div>
                  )}

                  {/* Thông báo không tìm thấy kết quả */}
                  {filteredHotels.length === 0 && hotels.length > 0 && (
                    <div style={{
                      textAlign: 'center',
                      padding: '40px',
                      color: '#999'
                    }}>
                      <h3>Không tìm thấy khách sạn phù hợp</h3>
                      <p>Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </>
        )}
      </Content>

      <Footer className="layout-home__footer">2025 copyright @Nhom5</Footer>
    </Layout>
  );
}

export default Discover;