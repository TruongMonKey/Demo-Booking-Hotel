import { useState, useEffect } from "react";
import { Checkbox, Col, Row } from "antd";
import { getHotels } from "../../Service/HotelService";


export default function RatingFilter({ onFilter }) {
  const [ratings, setRatings] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const hotels = await getHotels();

        const ratingCounts = {
          1: 0, // 1 sao
          2: 0, // 2 sao
          3: 0, // 3 sao
          4: 0, // 4 sao
          5: 0, // 5 sao
        };

        hotels.forEach((hotel) => {
          // Làm tròn xuống số sao từ rate
          const star = Math.floor(hotel.rate);
          if (star >= 1 && star <= 5) {
            ratingCounts[star] = (ratingCounts[star] || 0) + 1;
          }
        });

        // Định dạng dữ liệu cho bộ lọc (từ 1 sao đến 5 sao)
        const formattedRatings = Array.from({ length: 5 }, (_, index) => {
          const star = index + 1;
          return {
            label: `${star} sao`,
            count: ratingCounts[star],
            value: star,
          };
        });

        setRatings(formattedRatings);
      } catch (error) {
        console.error("Lỗi khi xử lý dữ liệu ratings:", error);
      }
    };

    fetchRatings();
  }, []);

  // Xử lý khi chọn bộ lọc
  const handleToggle = (value) => {
    const updatedRatings = selectedRatings.includes(value)
      ? selectedRatings.filter((r) => r !== value)
      : [...selectedRatings, value];

    setSelectedRatings(updatedRatings);
  };

  // Gửi dữ liệu lọc về component cha
  useEffect(() => {
    onFilter(selectedRatings);
  }, [selectedRatings, onFilter]);

  return (
    <div>
      <h3>Xếp hạng chỗ nghỉ</h3>
      <p>
        Tìm khách sạn và nhà nghỉ dưỡng chất lượng cao
      </p>
      <div>
        {ratings.length === 0 ? (
          <p>Đang tải...</p>
        ) : (
          ratings.map(({ label, count, value }) => (
            <Row gutter={[20, 20]} key={value}>
              <Col span={16}>
                <Checkbox
                  checked={selectedRatings.includes(value)}
                  onChange={() => handleToggle(value)}
                >
                  {label}
                </Checkbox>
              </Col>
              <Col span={4}>
                <span >{count}</span>
              </Col>
            </Row>
          ))
        )}
      </div>
    </div>
  );
}