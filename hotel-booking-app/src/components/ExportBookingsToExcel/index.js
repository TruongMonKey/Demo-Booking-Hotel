import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getHotelByID } from '../../Service/HotelService';

export const exportBookingsToExcel = async (bookings) => {
  if (!bookings || bookings.length === 0) {
    alert('Không có dữ liệu để xuất');
    return;
  }

  // Lấy thông tin chi tiết từng booking (hotelName,...)
  const enrichedBookings = await Promise.all(
    bookings.map(async (b) => {
      let hotelName = 'N/A';
      try {
        const response = await getHotelByID(b.hotelId);
        hotelName = response?.hotelList?.[0]?.name || 'N/A';
      } catch (error) {
        console.error(`Error fetching hotel ${b.hotelId}:`, error);
      }

      return {
        ID: b.id,
        'Khách hàng': b.user?.name || 'N/A',
        'Email': b.user?.email || 'N/A',
        'Số điện thoại': b.user?.phoneNumber || 'N/A',
        'Khách sạn': hotelName,
        'Loại phòng': b.room?.name || 'N/A',
        'Ngày đến': b.checkInDate || 'N/A',
        'Ngày đi': b.checkOutDate || 'N/A',
        'Trạng thái': b.status || 'N/A',
      };
    })
  );

  // Tạo file Excel
  const worksheet = XLSX.utils.json_to_sheet(enrichedBookings);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Đặt phòng');

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  const blob = new Blob([excelBuffer], {
    type: 'application/octet-stream',
  });

  saveAs(blob, `danh_sach_dat_phong_${new Date().toISOString().slice(0, 10)}.xlsx`);
};