import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getHotelByID } from "../../Service/HotelService";
import { FaLocationDot } from "react-icons/fa6";
import { Button, Col, DatePicker, Flex, Form, Row, Table, Tag, Tooltip } from "antd";
import ImageSlider from "../../components/ImageSlider";
import './Detail.scss';
import StarRating from "../../components/StarRating";
import { CheckCircleOutlined } from "@ant-design/icons";
import { TbParkingCircle } from "react-icons/tb";

function Detail() {
    const [data, setData] = useState();
    const param = useParams();
    const [form] = Form.useForm();
    const [time, setTime] = useState();
    const [selectedRoomTypeId, setSelectedRoomTypeId] = useState(null);
    const navigate = useNavigate();

    const availableServices = [
        'Xe đưa đón sân bay',
        'Phòng gia đình',
        'Phòng không hút thuốc',
        'Chỗ đỗ xe miễn phí',
        'Lễ tân 24 giờ',
        'Sân thượng / hiên',
        'Dịch vụ phòng',
        'Thang máy',
        'Giặt ủi',
        'Spa & massage',
        'Phòng gym',
    ];

    useEffect(() => {
        const fetchHotel = async () => {
            const response = await getHotelByID(param.id);
            setData(response.hotelList[0]);
        };
        fetchHotel();
    }, [param]);

    const handleDatePicker = (e) => {
        setTime(e);
    };

    const handleScrollToBookRoom = () => {
        const bookRoomSection = document.getElementById("bookRoom");
        if (bookRoomSection) {
            bookRoomSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleBookRoom = (id) => {
        setSelectedRoomTypeId(id);
        form.submit();
    };

    const handleFormSubmit = () => {
        if (time && selectedRoomTypeId) {
            const [check_in_date, check_out_date] = time.map(date => date.format("YYYY-MM-DD"));

            const bookingData = {
                hotelId: param.id,
                roomId: selectedRoomTypeId,
                checkInDate: check_in_date,
                checkOutDate: check_out_date,
            };

            navigate("/payment", { state: { bookingData } });
        }
    };

    const dataSource = data?.roomTypes ?? [];

    const columns = [
        {
            title: 'Loại chỗ nghỉ',
            dataIndex: 'name',
            key: 'name',
            render: (text) => text || "Chưa xác định",
        },
        {
            title: 'Số lượng giường',
            dataIndex: 'quantityBed',
            key: 'quantityBed',
            render: (value) => value !== undefined ? value : "Chưa xác định",
        },
        {
            title: 'Số lượng khách',
            dataIndex: 'quantityPeople',
            key: 'quantityPeople',
            render: (value) => value !== undefined ? value : "Chưa xác định",
        },
        {
            title: 'Diện tích',
            dataIndex: 'roomArea',
            key: 'roomArea',
            render: (roomArea) => roomArea !== undefined ? `${roomArea} m²` : "Chưa xác định",
        },

        {
            title: 'Các tiện nghi',
            dataIndex: 'amenities',
            key: 'amenities',
            render: (amenities) => (
                <div>
                    {Array.isArray(amenities) && amenities.length > 0 ? (
                        amenities.map((item) => (
                            <Tag key={item.id || item.name} color="processing">
                                {item.name || "Tiện ích không xác định"}
                            </Tag>
                        ))
                    ) : (
                        <span>Không có tiện ích</span>
                    )}
                </div>
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => price !== undefined ? `${price.toLocaleString('vi-VN')} VND` : "Chưa xác định",
        },
        {
            title: 'Hành động',
            dataIndex: 'id',
            key: 'action',
            render: (id, record) => (
                <Tooltip title={(!time && "Hãy chọn ngày đặt trước!") || (!localStorage.getItem("userId") && "Vui lòng đăng nhập trước!")}>
                    <Button
                        type="primary"
                        disabled={!time || !localStorage.getItem("userId")}
                        onClick={() => handleBookRoom(id)}
                    >
                        Đặt ngay
                    </Button>
                </Tooltip>
            ),
        },
    ];



    return (
        <>
            {!data ? (
                <div>Đang tải...</div>
            ) : (
                <>
                    <h1 className="title">{data.name} <StarRating rate={data.rate} /></h1>
                    <div className="address">
                        <a href={data.linkMap} target="_blank" rel="noopener noreferrer">
                            <FaLocationDot style={{ marginRight: "10px" }} />
                            {data.address}
                        </a>
                    </div>
                    <Row gutter={[20, 20]}>
                        <Col xxl={18} xl={18} lg={18} md={24} sm={24} span={24}>
                            <div className="slide">
                                <ImageSlider images={data.images.map((item)=> (item.imageUrl))} />
                            </div>
                        </Col>
                        <Col xxl={6} xl={6} lg={6} md={24} sm={24} span={24}>
                            <div className="box-evaluate">
                                <div className="box-evaluate__1">
                                    <Button type="primary" onClick={handleScrollToBookRoom}>
                                        Đặt ngay
                                    </Button>
                                </div>
                                <div>
                                    {data.rate >= 4 ? (
                                        <div className="box-evaluate__2">
                                            <div>
                                                <div className="type">VIP</div>
                                                <div className='quantity-review'>Lượt đánh giá</div>
                                            </div>
                                            <div className="rateStar">{data.rate} sao</div>
                                        </div>
                                    ) : (
                                        <div className="box-evaluate__2">
                                            <div>
                                                <div className="type">Thường</div>
                                                <div className='quantity-review'>Lượt đánh giá</div>
                                            </div>
                                            <div className="rateStar">{data.rate} sao</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <iframe
                                className="map"
                                title="Bản đồ"
                                src={`https://www.google.com/maps?q=${encodeURIComponent(data.address)}&output=embed`}
                                allowFullScreen={true}
                                referrerPolicy="no-referrer-when-downgrade"
                                loading="lazy"
                                width='100%'
                                height='272px'
                            ></iframe>
                        </Col>
                    </Row>
                    <Row gutter={[30, 20]}>
                        <Col xxl={16} xl={16} lg={16} md={24} sm={24} span={24}>
                            <div className="description">
                                <p>Khách sạn Sunrise Ocean tọa lạc ngay trung tâm thành phố, chỉ cách bãi biển vài bước chân, mang đến không gian kiến trúc hiện đại, sang trọng cùng tầm nhìn hướng biển tuyệt đẹp.</p>
                                <p>Với nhiều hạng phòng từ Standard, Deluxe đến Suite, mỗi phòng được thiết kế tinh tế, thoáng đãng và trang bị đầy đủ tiện nghi như điều hòa, TV màn hình phẳng, minibar, két an toàn cá nhân và Wi-Fi tốc độ cao, bạn sẽ có trải nghiệm nghỉ dưỡng thoải mái và đẳng cấp.</p>
                                <p>Khách sạn còn sở hữu hồ bơi ngoài trời, phòng gym & spa, nhà hàng phục vụ ẩm thực địa phương và quốc tế, quầy bar trên tầng thượng cùng dịch vụ phòng 24/7 và đưa đón sân bay (có phụ phí).</p>
                                <p>Đội ngũ nhân viên thân thiện, chuyên nghiệp luôn sẵn sàng hỗ trợ check-in/check-out nhanh chóng, tư vấn và đặt tour tham quan cho khách.</p>
                                <p>Đặc biệt, bạn sẽ được hưởng ưu đãi giảm 10% khi đặt phòng trước 30 ngày và miễn phí bữa sáng buffet cho trẻ em dưới 6 tuổi, cùng nhiều combo nghỉ dưỡng + spa tiết kiệm.</p>
                            </div>
                            <div>
                                <h3>Các tiện nghi được ưa chuộng nhất</h3>
                                <div className="service">
                                    <Flex gap="4px 0" wrap>
                                        {Array.isArray(availableServices) && availableServices.length > 0 ? (
                                            availableServices.map((item) => (
                                                <Tag
                                                    key={item.id || item}
                                                    className="service__item"
                                                    icon={<CheckCircleOutlined />}
                                                    color="processing"
                                                >
                                                    {item}
                                                </Tag>
                                            ))
                                        ) : (
                                            <span>Không có dịch vụ</span>
                                        )}
                                    </Flex>
                                </div>
                            </div>
                        </Col>
                        <Col xxl={8} xl={8} lg={8} md={0} sm={0} span={0}>
                            <div className="box-outstanding">
                                <h3>Điểm nổi bật của chỗ nghỉ</h3>
                                <div className="wrap">
                                    <TbParkingCircle className="icon-park" />
                                    <p className="desc">Có bãi đậu xe riêng miễn phí ở khách sạn này</p>
                                </div>
                                <h3>Khách trung thành</h3>
                                <p className="desc">Chỗ nghỉ này có nhiều khách trở lại hơn hầu hết các chỗ nghỉ khác.</p>
                                <Button type="primary" onClick={handleScrollToBookRoom} block>
                                    Đặt ngay
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={handleFormSubmit}
                    >
                        <Form.Item
                            name="dateRange"
                            rules={[
                                {
                                    required: true,
                                    message: 'Hãy chọn ngày đặt phòng',
                                },
                            ]}
                        >
                            <DatePicker.RangePicker
                                className="date-picker"
                                onChange={handleDatePicker}
                                format='DD-MM-YYYY'
                            />
                        </Form.Item>
                        <Form.Item>
                            <Table id="bookRoom" dataSource={dataSource} columns={columns} rowKey='id' />
                        </Form.Item>
                    </Form>
                    <h1>Đánh giá của khách</h1>
                </>
            )}
        </>
    );
}

export default Detail;