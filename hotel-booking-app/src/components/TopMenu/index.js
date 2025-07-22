import React from "react";
import { Menu } from "antd";
import { Link } from "react-router";
import {
  HomeOutlined,
  RocketOutlined,
  ShoppingOutlined,
  CarOutlined,
  AppstoreOutlined,
  BarcodeOutlined
} from "@ant-design/icons";
import './TopMenu.scss';

const TopMenu = () => {
  return (
    <Menu mode="horizontal" defaultSelectedKeys={['1']} className="top-menu" theme="dark">
      <Menu.Item key="1" icon={<HomeOutlined />} ><Link to="/discover">Lưu trú</Link></Menu.Item>
      <Menu.Item key="2" icon={<RocketOutlined />} disabled>Chuyến bay</Menu.Item>
      <Menu.Item key="3" icon={<ShoppingOutlined />} disabled>Chuyến bay + Khách sạn</Menu.Item>
      <Menu.Item key="4" icon={<CarOutlined />} disabled>Thuê xe</Menu.Item>
      <Menu.Item key="5" icon={<AppstoreOutlined />} disabled>Hoạt động</Menu.Item>
      <Menu.Item key="6" icon={<BarcodeOutlined />} disabled>Taxi sân bay</Menu.Item>
    </Menu>
  );
};

export default TopMenu;
