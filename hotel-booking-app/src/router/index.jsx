import React from 'react';
import LayoutDefault from '../layoutDefault/layoutDefault';
import CreateRoom from '../pages/CreateRoom';
import Dashboard from "../pages/Dashboard";
import Detail from '../pages/Detail';
import Discover from '../pages/Discover';
import Home from '../pages/Home';
import ListRoom from '../pages/ListRoom';
import LoginPage from '../pages/Login';
import Payment from '../pages/Payment';
import PrivateRouters from '../components/PrivateRouters';
import Profile from '../pages/Profile';
import { Account } from '../pages/Account';
import { QRcode } from '../pages/Payment/QRcode';

export const router = [
    {
        path: "/",
        element: <Home />
    },
    {
        path: "payment",
        element: <Payment />,
        children: [
            {
                path: "code",
                element: <QRcode/>
            }
        ]
    },
    {
        path: "discover",
        element: <Discover />,
        children: [
            {
                path: "detail/:id",
                element: <Detail />
            },
        ]
    },
    {
        path: "detail/:id",
        element: <Detail />
    },
    {
        path: "auth",
        element: <LoginPage />
    },
    {
        element: <PrivateRouters />,
        children: [
            {
                path: "/profile",
                element: <Profile/>,
            },
            {
                path: "/admin",
                element: <LayoutDefault />,
                children: [
                    {
                        index: true,
                        element: <Dashboard />
                    },
                    {
                        path: "create-room",
                        element: <CreateRoom />
                    },
                    {
                        path: "acc",
                        element: <Account/>
                    },
                    {
                        path: "list-room",
                        element: <ListRoom />,
                        children: [
                            {
                                path: "discover",
                                element: <Discover />,
                                children: [
                                    {
                                        path: "detail/:id",
                                        element: <Detail />
                                    },
                                ]
                            },
                        ]
                    }
                ]
            },
        ]
    },
    {
        path: "/*",
        element: (
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h2>404 - Trang không tồn tại</h2>
            <p>Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
            <a href="/" style={{ color: '#006ce4', fontWeight: 'bold' }}>Quay lại Trang chủ</a>
          </div>
        ),
    }
];
