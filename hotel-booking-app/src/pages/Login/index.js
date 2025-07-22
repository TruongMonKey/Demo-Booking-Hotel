import { Col, Row, Tabs } from 'antd';
import image from '../../image/Login.jpg'
import './LoginPage.scss'
import Login from './Login';
import Register from './Register';

function LoginPage() {

    const items = [
        {
            key: 'login',
            label: 'Đăng nhập',
            children: <Login />,
        },
        {
            key: 'register',
            label: 'Đăng ký',
            children: <Register/>,
        }
    ];

    return (
        <Row className='login-page'>
            <Col className='login-page__left' xxl={16} xl={16} lg={16} md={0} sm={0} span={0}>
                <img src={image} alt='ảnh đăng nhập'></img>
                <div className='content'>
                    <h2>Kết nối giá trị - Trải nghiệm tinh hoa cùng HotelBooking.com</h2>
                    <p>Bạn có thể đăng nhập tài khoản HotelBooking.com của mình để truy cập các dịch vụ của chúng tôi.</p>
                </div>
            </Col>
            <Col className='login-page__right' xxl={8} xl={8} lg={8} md={24} sm={24} span={24}>
                <Tabs defaultActiveKey="login" items={items} tabBarStyle={{
                    display: 'flex',
                    justifyContent: 'center',
                }} />
            </Col>
        </Row>
    )
}

export default LoginPage;