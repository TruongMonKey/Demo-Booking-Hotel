import { useState, useEffect } from 'react';
import { getHotelByID } from '../../Service/HotelService';

const BookingTable = ({ bookings }) => {
  const [hotelMap, setHotelMap] = useState({});

  useEffect(() => {
    const fetchHotels = async () => {
      const uniqueHotelIds = [...new Set(bookings?.map(b => b.hotelId))];

      // Lấy danh sách khách sạn
      const hotelEntries = await Promise.all(
        uniqueHotelIds.map(async (id) => {
          try {
            const response = await getHotelByID(id);
            const hotel = response?.hotelList?.[0]; // Lấy khách sạn đầu tiên từ hotelList
            return [id, hotel];
          } catch (error) {
            console.error(`Error fetching hotel ${id}:`, error);
            return [id, null];
          }
        })
      );

      // Lọc bỏ các cặp có giá trị null và tạo map
      setHotelMap(Object.fromEntries(hotelEntries.filter(([_, value]) => value)));
    };

    if (bookings?.length) {
      fetchHotels();
    }
  }, [bookings]);

  const parseDate = (dateStr) => new Date(dateStr);

  const sortedBookings = [...(bookings || [])].sort((a, b) => {
    const dateA = parseDate(a.checkInDate);
    const dateB = parseDate(b.checkInDate);
    return dateB - dateA;
  });

  const data = sortedBookings.slice(0, 10);

  return (
    <div className="booking-table col box-8">
      <h3>Đặt phòng gần đây</h3>
      {data.length === 0 ? (
        <p>Không có đặt phòng nào.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Khách sạn</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {data.map((booking) => {
              const hotel = hotelMap[booking.hotelId];
              const status = booking.status?.toLowerCase();

              return (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.user?.name || 'Đang tải...'}</td>
                  <td>{hotel?.name || 'Đang tải...'}</td>
                  <td>{booking.checkInDate || 'N/A'}</td>
                  <td>{booking.checkOutDate || 'N/A'}</td>
                  <td>
                    <span
                      className={`status ${
                        status === 'confirmed'
                          ? 'status-confirmed'
                          : status === 'pending'
                          ? 'status-pending'
                          : 'status-cancelled'
                      }`}
                    >
                      {status?.charAt(0).toUpperCase() + status?.slice(1) || 'N/A'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingTable;