import { useEffect, useState } from "react";
import './ListRoom.scss'
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons'
import { Tabs } from 'antd'
import TableRoom from "./TableRoom";
import { getHotels } from "../../Service/HotelService";
import GridHotel from "../../components/GridHotel";

function ListRoom() {
  const [rooms, setRooms] = useState([]);

  const fetchAPI = async () => {
    try {
      const response = await getHotels();
      console.log("[ListRoom] API Response:", response);
      // Normalize: handle both array and { data: array } response
      const hotelList = Array.isArray(response) ? response : (response?.data || []);
      console.log("[ListRoom] Normalized hotels:", hotelList);
      setRooms(hotelList);
    } catch (error) {
      console.error("[ListRoom] API Error:", error);
    }
  }
  
  useEffect(() => {
    fetchAPI();
  }, [])

  const handleReload = () => {
    fetchAPI();
  }

  const items = [
    {
      key: "grid",
      label: <><AppstoreOutlined /></>,
      children: <GridHotel data={rooms}/>,
    },
    {
      key: "table",
      label: <BarsOutlined />,
      children: <TableRoom record={rooms} reLoad={handleReload} />,
    }
  ]
  
  return (
    <>
      <h2>Quản lý khách sạn</h2>
      <Tabs items={items} />
    </>
  )
}

export default ListRoom;