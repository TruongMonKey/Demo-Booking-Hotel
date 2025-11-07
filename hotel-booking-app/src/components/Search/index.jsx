import { useState, useEffect } from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./HotelSearch.scss";

export default function HotelSearch({ onSearch, defaultKeyword = "" }) {
  const [keyword, setKeyword] = useState("");

  // Fill dữ liệu keyword từ Discover
  useEffect(() => {
    setKeyword(defaultKeyword);
  }, [defaultKeyword]);

  const handleSearch = () => {
    onSearch({ keyword });
  };

  return (
    <div className="hotel-search-bar">
      <div className="search-item">
        <SearchOutlined className="icon" />
        <Input
          placeholder="Nhập tên khách sạn hoặc địa điểm"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="input-field"
          variant="borderless"
        />
      </div>
      <Button type="primary" className="search-button" onClick={handleSearch}>
        Tìm
      </Button>
    </div>
  );
}
