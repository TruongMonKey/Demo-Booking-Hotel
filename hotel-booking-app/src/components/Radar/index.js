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
    const calculateBookingRatesByProvince = async (bookings) => {
      if (!bookings || bookings.length === 0) {
        return {
          labels: ['Hà Nội', 'Đà Nẵng', 'TP HCM'],
          dataRadar: [0, 0, 0],
        };
      }
  
      const bookingCountByProvince = {
        'Hà Nội': 0,
        'Đà Nẵng': 0,
        'Thành phố Hồ Chí Minh': 0,
      };
      

      const hotels = await Promise.all(
        bookings.map((b) => getHotelByID(b.hotelId))
      );
  
      bookings.forEach((booking, index) => {
        const hotel = hotels[index].hotelList[0];
        if (!hotel) return;
  
        const address = hotel.address || '';
        if (address.includes('Hà Nội')) {
          bookingCountByProvince['Hà Nội'] += 1;
        } else if (address.includes('Đà Nẵng')) {
          bookingCountByProvince['Đà Nẵng'] += 1;
        } else if (address.includes('Thành phố Hồ Chí Minh')) {
          bookingCountByProvince['Thành phố Hồ Chí Minh'] += 1;
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
