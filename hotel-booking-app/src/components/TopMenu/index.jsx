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
  const items = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: <Link to="/discover">Lưu trú</Link>,
    },
    {
      key: '2',
      icon: <RocketOutlined />,
      label: 'Chuyến bay',
      disabled: true,
    },
    {
      key: '3',
      icon: <ShoppingOutlined />,
      label: 'Chuyến bay + Khách sạn',
      disabled: true,
    },
    {
      key: '4',
      icon: <CarOutlined />,
      label: 'Thuê xe',
      disabled: true,
    },
    {
      key: '5',
      icon: <AppstoreOutlined />,
      label: 'Hoạt động',
      disabled: true,
    },
    {
      key: '6',
      icon: <BarcodeOutlined />,
      label: 'Taxi sân bay',
      disabled: true,
    },
  ];

  return (
    <Menu mode="horizontal" defaultSelectedKeys={['1']} className="top-menu" theme="dark" items={items} />
  );
};

export default TopMenu;
