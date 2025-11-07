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
    const response = await getHotels();
    setRooms(response.hotelList);
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