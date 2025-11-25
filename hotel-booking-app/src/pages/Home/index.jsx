// src/pages/Home/Home.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Layout, Pagination, Input } from "antd";
import './Home.scss';

import video_background from '../../videos/video_background3.mp4';
import { LeftOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import { BsArrowRight } from "react-icons/bs";

import LanguageSelector from "../../components/LanguageSelector";
import TopMenu from "../../components/TopMenu";
import GridHotel from "../../components/GridHotel";

import { getHotels } from "../../Service/HotelService";

const { Content, Footer } = Layout;

function capitalizeWords(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function Home() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalHotels, setTotalHotels] = useState(0);

  const token = localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    localStorage.removeItem("phone");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/");
  };

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await getHotels();
        console.debug("[Home] getHotels response:", response);

        // Normalize: support both (a) service returns array, (b) service returns object { data: [...] }
        const list = Array.isArray(response) ? response : (response?.data ?? []);
        console.debug("[Home] normalized hotel list length:", Array.isArray(list) ? list.length : 0);

        setData(list);
        setTotalHotels(Array.isArray(list) ? list.length : 0);

        // Reset to first page when data changes
        setCurrentPage(1);
      } catch (error) {
        console.error("Lỗi khi gọi API khách sạn:", error);
        setData([]);
        setTotalHotels(0);
      }
    };
    fetchAPI();
  }, []);

  const handleSearch = () => {
    if (!keyword.trim()) return;
    navigate(`/discover?keyword=${encodeURIComponent(keyword.trim())}`);
  };

  // Tính dữ liệu từng trang
  const getCurrentPageData = () => {
    if (!Array.isArray(data) || data.length === 0) return [];
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <Layout className="layout-welcome">
      <header className="layout-welcome__header">
        <div className="video-background">
          <video autoPlay loop muted playsInline>
            <source src={video_background} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>

          <div className="content">
            <div className="login-language">
              {token ? (
                <Link onClick={handleLogout}>
                  Đăng xuất <LeftOutlined /> /
                </Link>
              ) : (
                <Link to='/auth'>
                  Đăng nhập <RightOutlined /> /
                </Link>
              )}

              <LanguageSelector />

              <div className="profile">
                {token ? (
                  <Link to='/profile'>
                    {capitalizeWords(localStorage.getItem("fullName") || "")}
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="logo">
              <Link to="/">HotelBooking.com</Link>
            </div>

            <div className="menu">
              <TopMenu />
            </div>

            <div className="title">Tìm chỗ nghỉ tiếp theo</div>
            <div className="desciption">
              Tìm ưu đãi khách sạn, chỗ nghỉ dạng nhà và nhiều hơn nữa...
            </div>

            <Button className="button-discover">
              <Link to="/discover">
                <span>Khám phá</span>
                <BsArrowRight />
              </Link>
            </Button>
          </div>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="search">
          <div className="hotel-search-bar noborder">
            <div className="search-item">
              <SearchOutlined className="icon" />
              <Input
                placeholder="Nhập tên khách sạn hoặc địa điểm"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="input-field"
                variant="borderless"
                onPressEnter={handleSearch}
              />
            </div>

            <Button type="primary" className="search-button" onClick={handleSearch}>
              Tìm
            </Button>
          </div>
        </div>
      </header>

      <Content className="layout-welcome__conten">
        <h1 className="title">Gợi ý các chỗ nghỉ cho bạn</h1>

        <GridHotel data={getCurrentPageData()} />

        {totalHotels > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 40,
            marginBottom: 20
          }}>
            <Pagination
              current={currentPage}
              total={totalHotels}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={true}
              showQuickJumper={true}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} của ${total} khách sạn`
              }
              pageSizeOptions={['8', '16', '24', '32']}
            />
          </div>
        )}
      </Content>

      <Footer className="layout-home__footer">
        Copyright @monkeyy
      </Footer>
    </Layout>
  );
}
