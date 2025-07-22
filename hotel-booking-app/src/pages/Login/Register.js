import { Button, Form, Input, message } from "antd";
import { createUser } from "../../Service/UserServices";

function Register() {
    const [form] = Form.useForm();
    const onFinish = async values => {

        try {
            // Kiểm tra mật khẩu khớp nhau
            if (values.password !== values.verifyPassword) {
                message.error("Mật khẩu và xác nhận mật khẩu không khớp");
                return;
            }

            // Gọi API tạo người dùng
            const response = await createUser({
                email: values.email,
                phone: values.phone,
                name: values.name,
                password: values.password
            });

            if (response && (response.statusCode === 200 || response.status === 200)) {
                message.success("Đăng ký thành công");
                form.resetFields(); // Reset form khi thành công
                form.setFieldsValue({
                    email: '',
                    phone: '',
                    name: '',
                    password: '',
                    verifyPassword: ''
                });
            } else {
                message.error(response?.data?.message || "Đăng ký thất bại, vui lòng thử lại");
            }
        } catch (error) {
            console.error("Lỗi khi đăng ký:", error);
            const errorMessage = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
            message.error(errorMessage);
        }
    };
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <Form className="form"
                form={form}
                name="register"
                layout="vertical"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"

            >
                <Form.Item
                    label="Email "
                    name="email"
                    rules={[{ required: true, message: 'Mục này không được bỏ trống!' }]}
                >
                    <Input placeholder="Email " />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại "
                    name="phone"
                    rules={[{ required: true, message: 'Mục này không được bỏ trống!' }]}
                >
                    <Input placeholder="Số điện thoại " />
                </Form.Item>

                <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[{ required: true, message: 'Mục này không được bỏ trống!' }]}
                >
                    <Input placeholder="Họ và tên" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Mục này không được bỏ trống!' }]}
                >
                    <Input.Password placeholder="Mật khẩu " />
                </Form.Item>

                <Form.Item
                    label="Nhập lại mật khẩu"
                    name="verifyPassword"
                    rules={[{ required: true, message: 'Mục này không được bỏ trống!' }]}
                >
                    <Input.Password placeholder="Nhập lại mật khẩu" />
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Đăng ký
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Register;