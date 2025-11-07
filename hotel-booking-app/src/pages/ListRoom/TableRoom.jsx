import { Table, Tag, Typography } from "antd";
import DeleteRoom from "./DeleteRoom";
import EditRoom from "./EditRoom";

const { Title } = Typography;

function TableRoom(props) {
    const { record, reLoad } = props;

    // Tổng hợp tất cả phòng từ các khách sạn, hỗ trợ nhiều roomTypes
    const dataSource = Array.isArray(record)
        ? record.reduce((rooms, hotel) => {
              if (hotel?.roomTypes && Array.isArray(hotel.roomTypes)) {
                  return [
                      ...rooms,
                      ...hotel.roomTypes.map((room) => ({
                          ...room,
                          hotelName: hotel.name || "Khách sạn không xác định",
                          hotelId: hotel.id || "N/A",
                      })),
                  ];
              }
              return rooms;
          }, [])
        : record?.roomTypes
        ? record.roomTypes.map((room) => ({
              ...room,
              hotelName: record.name || "Khách sạn không xác định",
              hotelId: record.id || "N/A",
          }))
        : [];

    const columns = [
        {
            title: 'Khách sạn',
            dataIndex: 'hotelName',
            key: 'hotelName',
            render: (text) => text || "Chưa xác định",
        },
        {
            title: 'Tên phòng',
            dataIndex: 'name',
            key: 'name',
            render: (text) => text || "Chưa xác định",
        },
        {
            title: 'Số lượng giường',
            dataIndex: 'quantityBed',
            key: 'quantityBed',
            render: (value) => (value !== undefined && value !== null ? value : "Chưa xác định"),
        },
        {
            title: 'Số người tối đa',
            dataIndex: 'quantityPeople',
            key: 'quantityPeople',
            render: (value) => (value !== undefined && value !== null ? value : "Chưa xác định"),
        },
        {
            title: 'Diện tích phòng (m²)',
            dataIndex: 'roomArea',
            key: 'roomArea',
            render: (value) => (value !== undefined && value !== null ? value : "Chưa xác định"),
        },
        {
            title: 'Giá (VND)',
            dataIndex: 'price',
            key: 'price',
            render: (price) => (price !== undefined && price !== null ? price.toLocaleString('vi-VN') : "Chưa xác định"),
        },
        {
            title: 'Tiện ích',
            dataIndex: 'amenities',
            key: 'amenities',
            render: (_, { amenities }) => (
                <>
                    {Array.isArray(amenities) && amenities.length > 0 ? (
                        amenities.map((amenity) => (
                            <Tag color="blue" key={amenity.id || Math.random()}>
                                {amenity.name || "Tiện ích không xác định"}
                            </Tag>
                        ))
                    ) : (
                        <span>Không có tiện ích</span>
                    )}
                </>
            ),
        },
        {
            title: 'Hành động',
            dataIndex: 'id',
            key: 'action',
            render: (_, record) => (
                <>
                    <DeleteRoom idRoom={record.id} hotelId={record.hotelId} reLoad={reLoad} />
                    <EditRoom record={record} reLoad={reLoad} />
                </>
            ),
        },
    ];

    // Lọc bỏ các cột không có dữ liệu
    const filteredColumns = columns.filter((column) => {
        if (column.dataIndex === "id" || column.key === "action") return true; // Giữ cột hành động
        return dataSource.some((item) => {
            const value = column.dataIndex === "amenities" 
                ? item[column.dataIndex]
                : item[column.dataIndex];
            return value !== undefined && value !== null && 
                   (Array.isArray(value) ? value.length > 0 : true);
        });
    });

    return (
        <div>
            <Title level={4}>Danh sách phòng của tất cả khách sạn</Title>
            <Table
                dataSource={dataSource}
                columns={filteredColumns}
                rowKey="id"
                locale={{ emptyText: 'Không có dữ liệu phòng' }}
            />
        </div>
    );
}

export default TableRoom;