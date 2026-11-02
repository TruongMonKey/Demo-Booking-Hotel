import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

function MultiLine({ data }) {
  const bookings = data;

  // Chuyển đổi dữ liệu bookings thành số lượng đặt phòng theo tháng
  const calculateMonthlyBookings = (bookings) => {
    if (!bookings || bookings.length === 0) {
      return Array(12).fill(0);
    }

    const monthlyCount = Array(12).fill(0);
    const currentYear = new Date().getFullYear(); // ví dụ: 2025

    bookings.forEach((booking) => {
      const date = new Date(booking.checkInDate); // ISO format: yyyy-mm-dd
      const year = date.getFullYear();
      const month = date.getMonth(); // 0-based (0 = Jan)

      if (year === currentYear) {
        monthlyCount[month] += 1;
      }
    });

    return monthlyCount;
  };

  const monthlyData = calculateMonthlyBookings(bookings);
  const labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  const dataMultiLine = {
    labels,
    datasets: [
      {
        label: 'Đặt phòng 2025',
        data: monthlyData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Xu hướng đặt phòng 2025',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Số lượng đặt phòng',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Tháng',
        },
      },
    },
  };

  return <Line data={dataMultiLine} options={options} />;
};

export default MultiLine;