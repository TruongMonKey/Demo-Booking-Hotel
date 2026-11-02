// src/components/Search/index.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, DatePicker, Popover, AutoComplete } from 'antd';
import {
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  MinusOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './HotelSearch.scss';

const { RangePicker } = DatePicker;

const POPULAR_LOCATIONS = [
  { value: 'Đà Nẵng', label: 'Đà Nẵng (Bãi biển Mỹ Khê, Cầu Rồng)' },
  { value: 'Hà Nội', label: 'Hà Nội (Phố Cổ, Hồ Hoàn Kiếm)' },
  { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh (Quận 1, Bến Thành)' },
  { value: 'Phú Quốc', label: 'Phú Quốc (Bãi Khem, Dương Đông)' },
  { value: 'Nha Trang', label: 'Nha Trang (Trần Phú, Đảo Hòn Tre)' },
  { value: 'Hội An', label: 'Hội An (Phố Cổ Hội An, Cẩm Châu)' },
  { value: 'Đà Lạt', label: 'Đà Lạt (Hồ Tuyền Lâm, Thung lũng Tình Yêu)' },
  { value: 'Sa Pa', label: 'Sa Pa (Fansipan, Thung lũng Mường Hoa)' },
];

export default function HotelSearch({ onSearch, defaultKeyword = '', className = '' }) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [dates, setDates] = useState([
    dayjs().add(1, 'day'),
    dayjs().add(3, 'day')
  ]);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [guestPopoverOpen, setGuestPopoverOpen] = useState(false);

  useEffect(() => {
    if (defaultKeyword) {
      setKeyword(defaultKeyword);
    }
  }, [defaultKeyword]);

  const handleSearchSubmit = () => {
    const searchParams = {
      keyword: keyword.trim(),
      checkIn: dates?.[0]?.format('YYYY-MM-DD') || '',
      checkOut: dates?.[1]?.format('YYYY-MM-DD') || '',
      adults,
      children,
      rooms
    };

    if (onSearch) {
      onSearch(searchParams);
    } else {
      const query = new URLSearchParams();
      if (searchParams.keyword) query.set('keyword', searchParams.keyword);
      if (searchParams.checkIn) query.set('checkIn', searchParams.checkIn);
      if (searchParams.checkOut) query.set('checkOut', searchParams.checkOut);
      query.set('adults', adults);
      query.set('rooms', rooms);
      navigate(`/discover?${query.toString()}`);
    }
  };

  const guestContent = (
    <div className="ota-guest-dropdown">
      <div className="ota-guest-row">
        <div className="ota-guest-info">
          <span className="title">Người lớn</span>
          <span className="subtitle">Từ 18 tuổi trở lên</span>
        </div>
        <div className="ota-stepper">
          <Button
            size="small"
            icon={<MinusOutlined />}
            disabled={adults <= 1}
            onClick={() => setAdults(Math.max(1, adults - 1))}
          />
          <span className="count">{adults}</span>
          <Button
            size="small"
            icon={<PlusOutlined />}
            disabled={adults >= 10}
            onClick={() => setAdults(adults + 1)}
          />
        </div>
      </div>

      <div className="ota-guest-row">
        <div className="ota-guest-info">
          <span className="title">Trẻ em</span>
          <span className="subtitle">0 - 17 tuổi</span>
        </div>
        <div className="ota-stepper">
          <Button
            size="small"
            icon={<MinusOutlined />}
            disabled={children <= 0}
            onClick={() => setChildren(Math.max(0, children - 1))}
          />
          <span className="count">{children}</span>
          <Button
            size="small"
            icon={<PlusOutlined />}
            disabled={children >= 8}
            onClick={() => setChildren(children + 1)}
          />
        </div>
      </div>

      <div className="ota-guest-row">
        <div className="ota-guest-info">
          <span className="title">Phòng</span>
          <span className="subtitle">Số lượng phòng cần</span>
        </div>
        <div className="ota-stepper">
          <Button
            size="small"
            icon={<MinusOutlined />}
            disabled={rooms <= 1}
            onClick={() => setRooms(Math.max(1, rooms - 1))}
          />
          <span className="count">{rooms}</span>
          <Button
            size="small"
            icon={<PlusOutlined />}
            disabled={rooms >= 6}
            onClick={() => setRooms(rooms + 1)}
          />
        </div>
      </div>

      <div className="ota-guest-done">
        <Button
          type="primary"
          size="middle"
          block
          onClick={() => setGuestPopoverOpen(false)}
        >
          Xong
        </Button>
      </div>
    </div>
  );

  return (
    <div className={`ota-search-bar ${className}`}>
      {/* 1. Destination / Keyword */}
      <div className="ota-search-bar__item ota-search-bar__location">
        <EnvironmentOutlined className="ota-search-bar__icon" />
        <div className="ota-search-bar__input-wrapper">
          <span className="ota-search-bar__label">Địa điểm hoặc tên chỗ nghỉ</span>
          <AutoComplete
            options={POPULAR_LOCATIONS}
            value={keyword}
            onChange={(val) => setKeyword(val)}
            onSelect={(val) => setKeyword(val)}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 ||
              option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
            placeholder="Bạn muốn đến đâu?"
            className="ota-search-bar__input"
          />
        </div>
      </div>

      {/* 2. Date Range Picker */}
      <div className="ota-search-bar__item ota-search-bar__dates">
        <CalendarOutlined className="ota-search-bar__icon" />
        <div className="ota-search-bar__input-wrapper">
          <span className="ota-search-bar__label">Ngày nhận phòng — Ngày trả phòng</span>
          <RangePicker
            value={dates}
            onChange={(val) => setDates(val)}
            format="DD/MM/YYYY"
            placeholder={['Ngày nhận', 'Ngày trả']}
            disabledDate={(current) => current && current < dayjs().startOf('day')}
            className="ota-search-bar__datepicker"
            separator="—"
          />
        </div>
      </div>

      {/* 3. Guests and Rooms */}
      <Popover
        content={guestContent}
        trigger="click"
        open={guestPopoverOpen}
        onOpenChange={setGuestPopoverOpen}
        placement="bottomRight"
      >
        <div className="ota-search-bar__item ota-search-bar__guests">
          <UserOutlined className="ota-search-bar__icon" />
          <div className="ota-search-bar__input-wrapper">
            <span className="ota-search-bar__label">Số khách & Phòng</span>
            <div className="ota-search-bar__guests-display">
              {adults} người lớn · {children} trẻ em · {rooms} phòng
            </div>
          </div>
        </div>
      </Popover>

      {/* 4. Search CTA Button */}
      <div className="ota-search-bar__action">
        <Button
          type="primary"
          icon={<SearchOutlined />}
          className="ota-search-bar__btn"
          onClick={handleSearchSubmit}
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
}
