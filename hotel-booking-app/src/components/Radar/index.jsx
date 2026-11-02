import React, { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { getHotelByID } from '../../Service/HotelService';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const DemoRadar = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // trả về true nếu address chứa dấu hiệu TP HCM
    const isHCM = (address = '') => {
      if (!address) return false;
      const norm = address.toLowerCase();
      return (
        norm.includes('thành phố hồ chí minh') ||
        norm.includes('tp hcm') ||
        norm.includes('tp. hcm') ||
        norm.includes('ho chi minh') ||
        norm.includes('hcm') // thận trọng: có thể gây false positive nếu có 'HCM' trong tên khác
      );
    };

    const calculateBookingRatesByProvince = async (bookings) => {
      if (!bookings || bookings.length === 0) {
        return {
          labels: ['Hà Nội', 'Đà Nẵng', 'TP HCM'],
          dataRadar: [0, 0, 0],
        };
      }

      // cache để không gọi getHotelByID nhiều lần cho cùng 1 hotelId
      const hotelCache = new Map();

      // các tỉnh mục tiêu
      const bookingCountByProvince = {
        'Hà Nội': 0,
        'Đà Nẵng': 0,
        'Thành phố Hồ Chí Minh': 0,
      };

      // gọi getHotelByID cho các hotelId khác nhau (song song)
      const uniqueHotelIds = Array.from(new Set(bookings.map(b => b.hotelId).filter(Boolean)));
      await Promise.all(uniqueHotelIds.map(async (hid) => {
        try {
          const resp = await getHotelByID(hid);
          // đảm bảo resp tồn tại; backend có thể trả object khác
          hotelCache.set(hid, resp);
        } catch (err) {
          // lưu null để biểu thị lỗi / không tìm thấy
          hotelCache.set(hid, null);
          console.warn('Lỗi khi getHotelByID', hid, err);
        }
      }));

      // duyệt bookings và đếm
      bookings.forEach((booking) => {
        const hid = booking.hotelId;
        const hotelResp = hotelCache.get(hid);

        if (!hotelResp) {
          // không có dữ liệu hotel -> skip
          return;
        }

        // cố gắng lấy object hotel thật sự từ nhiều khả năng trả về của API
        // nhiều backend có thể trả { hotelList: [...] } hoặc { data: { hotels: [...] } } hoặc trực tiếp object
        let hotel = null;

        if (Array.isArray(hotelResp.hotelList) && hotelResp.hotelList.length > 0) {
          hotel = hotelResp.hotelList[0];
        } else if (Array.isArray(hotelResp.hotels) && hotelResp.hotels.length > 0) {
          hotel = hotelResp.hotels[0];
        } else if (hotelResp.data && Array.isArray(hotelResp.data.hotelList) && hotelResp.data.hotelList.length > 0) {
          hotel = hotelResp.data.hotelList[0];
        } else if (hotelResp.data && hotelResp.data.address) {
          hotel = hotelResp.data; // có thể trả 1 object duy nhất
        } else if (hotelResp.address) {
          hotel = hotelResp;
        }

        if (!hotel) {
          // không tìm thấy dữ liệu hotel hợp lệ
          return;
        }

        const address = hotel.address || '';
        if (address.includes('Hà Nội') || address.includes('HANOI') || address.toLowerCase().includes('hà nội')) {
          bookingCountByProvince['Hà Nội'] += 1;
        } else if (address.includes('Đà Nẵng') || address.toLowerCase().includes('đà nẵng')) {
          bookingCountByProvince['Đà Nẵng'] += 1;
        } else if (isHCM(address)) {
          bookingCountByProvince['Thành phố Hồ Chí Minh'] += 1;
        } else {
          // Nếu muốn: xử lý tỉnh khác hoặc log để cải thiện mapping
        }
      });

      const totalBookings = bookings.length;
      const labels = ['Hà Nội', 'Đà Nẵng', 'TP HCM'];

      const dataRadar = labels.map((province) => {
        if (province === 'TP HCM') {
          return totalBookings > 0
            ? Math.round((bookingCountByProvince['Thành phố Hồ Chí Minh'] / totalBookings) * 100)
            : 0;
        }
        return totalBookings > 0
          ? Math.round((bookingCountByProvince[province] / totalBookings) * 100)
          : 0;
      });

      return { labels, dataRadar };
    };

    const prepareChart = async () => {
      try {
        const { labels, dataRadar } = await calculateBookingRatesByProvince(data);
        setChartData({
          labels,
          datasets: [
            {
              label: 'Tỷ lệ đặt phòng (%)',
              data: dataRadar,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error('Lỗi khi chuẩn bị dữ liệu biểu đồ:', err);
        setChartData({
          labels: ['Hà Nội', 'Đà Nẵng', 'TP HCM'],
          datasets: [
            {
              label: 'Tỷ lệ đặt phòng (%)',
              data: [0, 0, 0],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 1,
            },
          ],
        });
      }
    };

    prepareChart();
  }, [data]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tỷ lệ đặt phòng theo tỉnh',
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  if (!chartData) return <p>Đang tải dữ liệu biểu đồ...</p>;

  return <Radar data={chartData} options={options} />;
};

export default DemoRadar;
