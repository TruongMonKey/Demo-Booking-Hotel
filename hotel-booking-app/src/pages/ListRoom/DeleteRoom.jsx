import { Button, Popconfirm, message } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import { getHotelByID } from "../../Service/HotelService";
import { deleteRoom, editHotel } from "../../Service/RoomService";

function DeleteRoom(props) {
    const { idRoom, hotelId, reLoad } = props;

    const [messageApi, contextHolder] = message.useMessage();

    const handleDelete = async () => {
        try {
            // Lấy dữ liệu khách sạn hiện tại
            const hotelResponse = await getHotelByID(hotelId);
            const hotelData = hotelResponse.data || hotelResponse;

            // Lọc bỏ phòng có idRoom khỏi mảng roomTypes
            // const updatedRoomTypes = hotelData.roomTypes.filter((room) => room.id !== idRoom);

            // Cập nhật khách sạn với roomTypes mới
            const response = await deleteRoom(idRoom);
            if (response.statusCode == 200) {
                messageApi.open({
                    type: "success",
                    content: "Xóa phòng thành công",
                });
                reLoad();
            } else {
                throw new Error(response?.message || "Xóa phòng thất bại");
            }
        } catch (error) {
            messageApi.open({
                type: "error",
                content: error.message || "Xóa phòng thất bại",
            });
        }
    };

    return (
        <>
            {contextHolder}
            <Popconfirm title="Bạn có chắc muốn xóa không?" onConfirm={handleDelete}>
                <Button danger><DeleteOutlined /></Button>
            </Popconfirm>
        </>
    );
}

export default DeleteRoom;