import { useEffect, useState } from "react";
import { Card, Avatar, Button, Typography, Space, Table, Tag } from "antd";
import {
    MailOutlined,
    PhoneOutlined,
    UserOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Profile.scss";
import { getUserById } from "../../Service/UserServices";

const { Title, Text } = Typography;

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem("userId")?.trim();
                if (!userId) return;

                const res = await getUserById(userId);
                const userData = res.user;
                console.log(userData);
                

                const enrichedBookings = (userData.bookings || []).map((b) => ({
                    ...b,
                    key: b.id,
                }));

                setUser({
                    ...userData,
                    bookings: enrichedBookings,
                });

                // Lưu thông tin vào localStorage để đồng bộ
                localStorage.setItem("fullName", userData.name || "Chưa có tên");
                localStorage.setItem("email", userData.email || "Chưa có email");
                localStorage.setItem("phone", userData.phoneNumber || "Chưa có số điện thoại");
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu người dùng:", error);
            }
        };

        fetchUser();
    }, []);

    const columns = [
        {
            title: "Loại phòng",
            dataIndex: "room",
            key: "roomName",
            render: (room) => <div>{room?.name || "Không rõ"}</div>,
        },
        {
            title: "Ngày nhận phòng",
            dataIndex: "checkInDate",
            key: "checkInDate",
        },
        {
            title: "Ngày trả phòng",
            dataIndex: "checkOutDate",
            key: "checkOutDate",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                let color = "default";
                const lower = status?.toLowerCase();

                if (lower === "confirmed") color = "green";
                else if (lower === "pending") color = "orange";
                else if (lower === "canceled" || lower === "cancelled") color = "red"; // Xử lý cả "cancelled"

                return <Tag color={color}>{status}</Tag>;
            },
        },
    ];

    return (
        <div className="profile-container">
            <Card className="profile-card">
                <div className="profile-header">
                    <Button
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                        className="profile-back-button"
                    >
                        Quay lại
                    </Button>
                </div>

                <div className="profile-horizontal">
                    <Avatar size={100} icon={<UserOutlined />} />
                    <div className="profile-info">
                        <Title level={3}>{user?.name || localStorage.getItem("fullName") || "Chưa có tên"}</Title>
                        <Space direction="vertical" size="small">
                            <Text>
                                <MailOutlined /> {user?.email || localStorage.getItem("email") || "Chưa có email"}
                            </Text>
                            <Text>
                                <PhoneOutlined /> {user?.phoneNumber || localStorage.getItem("phone") || "Chưa có số điện thoại"}
                            </Text>
                        </Space>
                    </div>
                </div>

                <div className="profile-extra">
                    <h2 style={{ marginBottom: "20px" }}>Danh sách phòng đã đặt:</h2>
                    <Table
                        dataSource={user?.bookings || []}
                        columns={columns}
                        pagination={false}
                        rowKey="key"
                    />
                </div>
            </Card>
        </div>
    );
}