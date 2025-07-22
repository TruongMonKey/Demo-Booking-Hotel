import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Layout, Pagination } from "antd";
import './Home.scss';
import video_background from '../../videos/video_background3.mp4';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import LanguageSelector from "../../components/LanguageSelector";
import { BsArrowRight } from "react-icons/bs";
import TopMenu from "../../components/TopMenu";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import GridHotel from "../../components/GridHotel";
import { getHotels } from "../../Service/HotelService";

const { Content, Footer } = Layout;

function capitalizeWords(str) {
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
  const [pageSize, setPageSize] = useState(8); // Số hotel hiển thị mỗi trang
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
        const list = response?.hotelList ?? []; // fallback nếu undefined
        setData(list);
        setTotalHotels(list.length);
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

  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    // Scroll to top khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                  <Link to='/profile'>{capitalizeWords(localStorage.getItem("fullName"))}</Link>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="logo">
              <Link to={"/"}>HotelBooking.com</Link>
            </div>
            <div className="menu"><TopMenu /></div>
            <div className="title">Tìm chỗ nghỉ tiếp theo</div>
            <div className="desciption">Tìm ưu đãi khách sạn, chỗ nghỉ dạng nhà và nhiều hơn nữa...</div>
            <Button className="button-discover">
              <Link to={'/discover'}>
                <span>Khám phá</span>
                <BsArrowRight />
              </Link>
            </Button>
          </div>
        </div>
        {/* search mới */}
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

        {/* Pagination Component */}
        {totalHotels > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '40px',
            marginBottom: '20px'
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
      </Content>

      <Footer className="layout-home__footer">
        2025 copyright @Nhom5
      </Footer>
    </Layout>
  );
}