import { Table, Button, Popconfirm, Select, message, Space } from 'antd';
import { useEffect, useState } from 'react';
import { delUserById, getAllUser, updateRole } from '../../Service/UserServices';
import { useNavigate } from 'react-router-dom';

export function Account() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const role = localStorage.getItem("role")

    const fetchUsers = async () => {
        const response = await getAllUser();
        setUsers(response.userList);
    };

    useEffect(() => {
        if (role !== 'ADMIN') {
            alert("Bạn không có quyền truy cập");
            navigate('/admin'); 
        }

        fetchUsers();
    }, []);

    const handleRoleChange = async (id, newRole) => {
        const response = await updateRole(id, { "role": `${newRole}` })
        if (response.statusCode == 200) {
            const updatedUsers = users.map(user =>
                user.id === id ? { ...user, role: newRole } : user
            );
            setUsers(updatedUsers);
            message.success('Cập nhật quyền thành công!');
        }
        else message.error('Cập nhật quyền thất bại!');

    };

    const handleDelete = async (id) => {
        const response = await delUserById(id);
        if (response.statusCode === 200) {
            message.success('Xóa người dùng thành công!');
            await fetchUsers(); // 👈 gọi lại để load dữ liệu mới
        } else {
            message.error("Xóa người dùng thất bại");
        }
    };



    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Số lượng đặt',
            key: 'bookingCount',
            render: (_, record) => record.bookings?.length || 0,
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (text, record) => (
                <Select
                    value={record.role}
                    style={{ width: 120 }}
                    onChange={(value) => handleRoleChange(record.id, value)}
                    disabled={record.role === 'ADMIN'}
                >
                    <Select.Option value="manager">Manager</Select.Option>
                    <Select.Option value="customer">Customer</Select.Option>
                </Select>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Popconfirm
                    title="Bạn có chắc muốn xóa người này?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <Button danger>Xóa</Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <>
            <h1 style={{ marginBottom: "40px" }}>Quản lý tài khoản</h1>
            <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                bordered
            />
        </>
    );
}
