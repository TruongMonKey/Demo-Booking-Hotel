// src/pages/Discover/index.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation, useParams, useNavigate, Outlet, Link } from 'react-router-dom';
import {
  Breadcrumb,
  Checkbox,
  Slider,
  Select,
  Pagination,
  Button,
  Empty
} from 'antd';
import {
  FilterOutlined,
  ReloadOutlined,
  HomeOutlined,
  StarFilled
} from '@ant-design/icons';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import HotelSearch from '../../components/Search';
import ListHotel from './ListHotel';
import { getHotels } from '../../Service/HotelService';
import './Discover.scss';

export default function Discover() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [freeCancelOnly, setFreeCancelOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const location = useLocation();
  const param = useParams();
  const navigate = useNavigate();

  // If viewing hotel detail inside /discover/detail/:id
  if (param.id) {
    return <Outlet />;
  }

  // Parse query params on load or URL change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const kw = params.get('keyword') || '';
    setKeyword(kw);
    setCurrentPage(1);
  }, [location.search]);

  // Fetch hotels
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const response = await getHotels();
        const list = Array.isArray(response) ? response : (response?.data || []);
        setHotels(list);
      } catch (err) {
        console.error('Lỗi khi tải danh sách khách sạn:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  // Filter & Sort Logic
  const filteredHotels = useMemo(() => {
    let result = [...hotels];

    // 1. Search Keyword
    if (keyword.trim()) {
      const q = keyword.trim().toLowerCase();
      result = result.filter(
        (h) =>
          h.name?.toLowerCase().includes(q) ||
          h.address?.toLowerCase().includes(q) ||
          h.city?.toLowerCase().includes(q) ||
          h.description?.toLowerCase().includes(q)
      );
    }

    // 2. Star Ratings Filter
    if (selectedRatings.length > 0) {
      result = result.filter((h) => selectedRatings.includes(Math.floor(h.rate || 0)));
    }

    // 3. Price Filter
    result = result.filter((h) => {
      const price = h.roomTypes?.[0]?.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // 4. Free Cancel Filter
    if (freeCancelOnly) {
      result = result.filter((h) => h.cancel === true);
    }

    // 5. Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.roomTypes?.[0]?.price || 0) - (b.roomTypes?.[0]?.price || 0));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.roomTypes?.[0]?.price || 0) - (a.roomTypes?.[0]?.price || 0));
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => (b.rate || 0) - (a.rate || 0));
    }

    return result;
  }, [hotels, keyword, selectedRatings, priceRange, freeCancelOnly, sortBy]);

  // Pagination slice
  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredHotels.slice(start, start + pageSize);
  }, [filteredHotels, currentPage, pageSize]);

  // Handle Search Submission
  const handleSearchSubmit = ({ keyword: newKeyword }) => {
    const params = new URLSearchParams(location.search);
    if (newKeyword) {
      params.set('keyword', newKeyword);
    } else {
      params.delete('keyword');
    }
    navigate(`/discover?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setSelectedRatings([]);
    setPriceRange([0, 10000000]);
    setSelectedAmenities([]);
    setFreeCancelOnly(false);
    setSortBy('popular');
    setCurrentPage(1);
  };

  return (
    <div className="ota-discover-page">
      <Navbar activeTab="stays" />

      {/* Top Search Banner */}
      <section className="ota-discover-search-strip">
        <div className="ota-discover-container">
          <HotelSearch
            onSearch={handleSearchSubmit}
            defaultKeyword={keyword}
            className="ota-discover-search-bar"
          />
        </div>
      </section>

      {/* Main Results Container */}
      <main className="ota-discover-main">
        <div className="ota-discover-container">
          {/* Breadcrumb */}
          <div className="ota-discover-breadcrumb">
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
                  title: 'Khám phá chỗ nghỉ',
                },
                ...(keyword ? [{ title: keyword }] : []),
              ]}
            />
          </div>

          <div className="ota-discover-layout">
            {/* Left Filter Sidebar */}
            <aside className="ota-filter-sidebar">
              <div className="ota-filter-sidebar__header">
                <h3>
                  <FilterOutlined /> Chọn lọc theo:
                </h3>
                <button className="ota-filter-reset-btn" onClick={handleResetFilters}>
                  <ReloadOutlined /> Đặt lại
                </button>
              </div>

              {/* Filter: Star Rating */}
              <div className="ota-filter-group">
                <h4 className="ota-filter-group__title">Xếp hạng sao</h4>
                <Checkbox.Group
                  value={selectedRatings}
                  onChange={(vals) => {
                    setSelectedRatings(vals);
                    setCurrentPage(1);
                  }}
                  className="ota-filter-checkboxes"
                >
                  {[5, 4, 3, 2].map((star) => (
                    <div key={star} className="ota-filter-option">
                      <Checkbox value={star}>
                        <span className="star-display">
                          {star} sao
                          <span className="stars-icons">
                            {Array.from({ length: star }).map((_, i) => (
                              <StarFilled key={i} style={{ color: '#f59e0b', fontSize: '11px', marginLeft: '2px' }} />
                            ))}
                          </span>
                        </span>
                      </Checkbox>
                    </div>
                  ))}
                </Checkbox.Group>
              </div>

              {/* Filter: Price Range */}
              <div className="ota-filter-group">
                <h4 className="ota-filter-group__title">Ngân sách (mỗi đêm)</h4>
                <div className="ota-price-range-text">
                  <span>{priceRange[0].toLocaleString('vi-VN')}₫</span>
                  <span>—</span>
                  <span>{priceRange[1] >= 10000000 ? '10.000.000₫+' : `${priceRange[1].toLocaleString('vi-VN')}₫`}</span>
                </div>
                <Slider
                  range
                  min={0}
                  max={10000000}
                  step={200000}
                  value={priceRange}
                  onChange={(val) => {
                    setPriceRange(val);
                    setCurrentPage(1);
                  }}
                />
                <div className="ota-quick-budget-pills">
                  <button
                    className="budget-pill"
                    onClick={() => { setPriceRange([0, 1500000]); setCurrentPage(1); }}
                  >
                    Dưới 1.5M
                  </button>
                  <button
                    className="budget-pill"
                    onClick={() => { setPriceRange([1500000, 3500000]); setCurrentPage(1); }}
                  >
                    1.5M - 3.5M
                  </button>
                  <button
                    className="budget-pill"
                    onClick={() => { setPriceRange([3500000, 10000000]); setCurrentPage(1); }}
                  >
                    Trên 3.5M
                  </button>
                </div>
              </div>

              {/* Filter: Cancellation Policy */}
              <div className="ota-filter-group">
                <h4 className="ota-filter-group__title">Chính sách đặt phòng</h4>
                <div className="ota-filter-option">
                  <Checkbox
                    checked={freeCancelOnly}
                    onChange={(e) => {
                      setFreeCancelOnly(e.target.checked);
                      setCurrentPage(1);
                    }}
                  >
                    Miễn phí hủy phòng
                  </Checkbox>
                </div>
              </div>

              {/* Map Promotion Teaser */}
              <div className="ota-filter-map-box">
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=400&q=80"
                  alt="Bản đồ khách sạn"
                  className="map-thumbnail"
                />
                <div className="map-overlay">
                  <Button type="primary" size="small" onClick={() => window.open('https://maps.google.com', '_blank')}>
                    Xem trên bản đồ
                  </Button>
                </div>
              </div>
            </aside>

            {/* Right Results Column */}
            <section className="ota-results-section">
              {/* Results Topbar */}
              <div className="ota-results-topbar">
                <div className="ota-results-count">
                  <h2>
                    {keyword ? `${keyword}: ` : ''}
                    tìm thấy <strong>{filteredHotels.length}</strong> chỗ nghỉ
                  </h2>
                </div>

                <div className="ota-sort-box">
                  <span className="sort-label">Sắp xếp theo:</span>
                  <Select
                    value={sortBy}
                    onChange={(val) => setSortBy(val)}
                    style={{ width: 190 }}
                    options={[
                      { value: 'popular', label: 'Gợi ý hàng đầu' },
                      { value: 'price-asc', label: 'Giá: Thấp đến cao' },
                      { value: 'price-desc', label: 'Giá: Cao đến thấp' },
                      { value: 'rating-desc', label: 'Điểm đánh giá cao nhất' },
                    ]}
                  />
                </div>
              </div>

              {/* Hotel List */}
              {currentPageData.length > 0 ? (
                <>
                  <ListHotel data={currentPageData} />

                  {/* Pagination */}
                  {filteredHotels.length > pageSize && (
                    <div className="ota-results-pagination">
                      <Pagination
                        current={currentPage}
                        total={filteredHotels.length}
                        pageSize={pageSize}
                        onChange={(page) => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 120, behavior: 'smooth' });
                        }}
                        showSizeChanger={false}
                        showTotal={(total, range) =>
                          `${range[0]}-${range[1]} của ${total} khách sạn`
                        }
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="ota-no-results">
                  <Empty
                    description={
                      <div>
                        <h3>Không tìm thấy chỗ nghỉ nào phù hợp</h3>
                        <p>Hãy thử xóa một số bộ lọc hoặc thay đổi từ khóa tìm kiếm</p>
                      </div>
                    }
                  >
                    <Button type="primary" onClick={handleResetFilters}>
                      Đặt lại bộ lọc
                    </Button>
                  </Empty>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
