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
      if (type !== "Phone number" && type !== "Email") {
        message.error("Vui lòng nhập số điện thoại hoặc email hợp lệ!");
        setLoading(false);
        return;
      }

      const options = { username, password };

      // login() nên trả về object data đã unwrap hoặc throw error
      const response = await login(options);

      // Nếu service trả về axios response, lấy .data
      const data = response?.data ?? response;

      // backend có thể trả access_token hoặc accessToken — handle both
      const accessToken = data?.accessToken ?? data?.access_token ?? data?.access_token;

      if (data && data.user && accessToken) {
        const user = data.user;

        // lưu token: nếu user chọn "remember", dùng localStorage, nếu không thì sessionStorage
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("accessToken", accessToken);

        // lưu thông tin user (ít nhất những gì cần thiết)
        storage.setItem("userId", user.id);
        storage.setItem("fullName", user.name);
        storage.setItem("email", user.email);
        storage.setItem("roles", JSON.stringify(user.roles || []));

        // set axios default header nếu bạn dùng axiosInstance (tùy project)
        // import api from '../api/axiosInstance'; api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        message.success("Đăng nhập thành công");

        // điều hướng theo role
        const roles = user.roles || [];
        if (roles.includes("ROLE_ADMIN") || roles.includes("ROLE_MANAGER")) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        // fallback: nếu API trả lỗi dạng { error: '...' }
        const errMsg = data?.message || data?.error || "Đăng nhập thất bại, vui lòng kiểm tra username và mật khẩu!";
        message.error(errMsg);
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      // Nếu backend trả message chi tiết
      const serverMsg = error?.response?.data?.message || error?.message;
      message.error(serverMsg || "Đã có lỗi xảy ra, vui lòng thử lại!");
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
        name="login"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          className="username"
          label="Email hoặc số điện thoại"
          name="username"
          rules={[{ required: true, message: "Mục này không được bỏ trống!" }]}
        >
          <Input placeholder="Nhập email hoặc số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Mục này không được bỏ trống!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" label={null}>
          <Checkbox>Nhớ tài khoản</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
