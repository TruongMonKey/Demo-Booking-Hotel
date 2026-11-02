import React, { useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "../../Service/UserServices";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Hàm kiểm tra định dạng username
  const checkString = (string) => {
    if (!string) return "Neither";
    const phonePattern = /^(?:\+84|0)[0-9]{9,10}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (phonePattern.test(string)) return "Phone number";
    if (emailPattern.test(string)) return "Email";
    return "Neither";
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const username = values.username?.trim();
      const password = values.password?.trim();
      const remember = !!values.remember;

      const type = checkString(username);
      if (type !== "Phone number" && type !== "Email" && username !== "admin") {
        message.error("Vui lòng nhập email hoặc số điện thoại hợp lệ!");
        setLoading(false);
        return;
      }

      const options = { username, password };
      const response = await login(options);

      if (response?.error) {
        message.error(response?.message || "Đăng nhập thất bại");
        return;
      }

      const data = response?.data ?? response;
      const accessToken = data?.accessToken ?? data?.access_token;

      if (data && data.user && accessToken) {
        const user = data.user;
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("accessToken", accessToken);
        storage.setItem("userId", user.id);
        storage.setItem("fullName", user.name);
        storage.setItem("email", user.email);
        storage.setItem("roles", JSON.stringify(user.roles || []));

        message.success("Đăng nhập thành công!");

        const roles = user.roles || [];
        if (roles.includes("ROLE_ADMIN") || roles.includes("ROLE_MANAGER")) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        message.error(data?.message || "Đăng nhập thất bại, vui lòng kiểm tra thông tin!");
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      message.error(error?.message || "Đã có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form
        className="form"
        name="login"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Email hoặc số điện thoại"
          name="username"
          rules={[{ required: true, message: "Mục này không được bỏ trống!" }]}
        >
          <Input placeholder="admin@gmail.com hoặc email của bạn" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Mục này không được bỏ trống!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu (ví dụ: 123456)" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Ghi nhớ tài khoản</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
            Đăng nhập
          </Button>
        </Form.Item>

        <div className="demo-hint">
          Tài khoản Admin demo: <strong>admin@gmail.com</strong> / Mật khẩu bất kỳ.
        </div>
      </Form>
    </div>
  );
}

export default Login;
