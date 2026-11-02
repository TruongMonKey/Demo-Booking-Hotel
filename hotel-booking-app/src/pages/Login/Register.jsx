import { Button, Form, Input, message } from "antd";
import { createUser } from "../../Service/UserServices";
import { useState } from "react";

function Register() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const isSuccessResponse = (res) => {
        // Trường hợp 1: wrapper kiểu { statusCode, message, data }
        if (res == null) return false;
        if (res.statusCode && Number(res.statusCode) === 201) return true;
        if (res.ok === true) return true;

        // Trường hợp 2: backend trả trực tiếp user DTO { id, email, ... }
        if (res.id && typeof res.id === "string") return true;

        // Trường hợp 3: nếu wrapper chứa data user
        if (res.data && res.data.id) return true;

        return false;
    };

    const getServerMessage = (res) => {
        if (!res) return null;
        if (res.message) return res.message;
        if (res.data && res.data.message) return res.data.message;
        return null;
    };

    const onFinish = async (values) => {
        if (loading) return; // prevent double submit
        try {
            await form.validateFields();

            const payload = {
                email: values.email?.trim(),
                phone: values.phone?.trim(),
                name: values.name?.trim(),
                password: values.password
            };

            setLoading(true);

            const response = await createUser(payload);

            // Normalize: response could be wrapper or direct DTO or normalized service object
            // Show server error if present and not success
            if (!isSuccessResponse(response)) {
                const serverMsg = getServerMessage(response);
                message.error(serverMsg || "Đăng ký thất bại");
                return;
            }

            // Success
            const serverMsg = getServerMessage(response);
            message.success(serverMsg || "Đăng ký thành công!");
            form.resetFields();

        } catch (error) {
            console.error("[Register] Uncaught error:", error);
            // If axios error normalized by service, it might be an object; otherwise fallback
            const serverMsg = error?.message || "Có lỗi xảy ra, vui lòng thử lại!";
            message.error(serverMsg);
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <div>
            <Form
                className="form"
                form={form}
                name="register"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Mục này không được bỏ trống!" },
                        { type: "email", message: "Email không hợp lệ" }
                    ]}
                >
                    <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                        { required: true, message: "Mục này không được bỏ trống!" },
                        { pattern: /^\d{9,12}$/, message: "Số điện thoại không hợp lệ" }
                    ]}
                >
                    <Input placeholder="Số điện thoại" />
                </Form.Item>

                <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[{ required: true, message: "Mục này không được bỏ trống!" }]}
                >
                    <Input placeholder="Họ và tên" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[
                        { required: true, message: "Mục này không được bỏ trống!" },
                        { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" }
                    ]}
                    hasFeedback
                >
                    <Input.Password placeholder="Mật khẩu" />
                </Form.Item>

                <Form.Item
                    label="Nhập lại mật khẩu"
                    name="verifyPassword"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                        { required: true, message: "Mục này không được bỏ trống!" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Mật khẩu không khớp"));
                            }
                        })
                    ]}
                >
                    <Input.Password placeholder="Nhập lại mật khẩu" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Đăng ký
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Register;
