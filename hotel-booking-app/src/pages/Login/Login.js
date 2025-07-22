import { Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { message } from 'antd';
import { getAllUser, login } from "../../Service/UserServices";

const getUsersId = async (email) => {
    const response = await getAllUser();
    const data = response.userList.find(item => item.email == email);
    localStorage.setItem("userId", data.id );
}

function Login() {
    const navigate = useNavigate();

    function checkString(string) {
        const phonePattern = /^(?:\+84|0)[0-9]{9,10}$/;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (phonePattern.test(string)) {
            return "Phone number";
        } else if (emailPattern.test(string)) {
            return "Email";
        } else {
            return "Neither";
        }
    }

    const onFinish = async (values) => {
        try {
            // Lấy và làm sạch dữ liệu từ form
            const username = values.username?.trim();
            const password = values.password?.trim();

            // Kiểm tra định dạng username
            const type = checkString(username);
            if (type !== 'Phone number' && type !== 'Email') {
                message.error('Vui lòng nhập số điện thoại hoặc email hợp lệ!');
                return;
            }

            const options = {
                email: username,
                password: password,
            }

            const response = await login(options);            
            
            if(response.statusCode === 200){
                localStorage.setItem("accessToken", response.token);
                getUsersId(response.email);
                localStorage.setItem("fullName", response.fullName);
                localStorage.setItem("email", response.email);
                localStorage.setItem("phone", response.phone);
                localStorage.setItem("role", response.role);

               

                if(response.role === "ADMIN" || response.role === "manager"){
                    message.success("Đăng nhập thành công");
                    navigate("/admin");
                }else {
                    message.success("Đăng nhập thành công");
                    navigate("/")
                }
            }
            

        } catch (error) {
            console.error('Lỗi khi đăng nhập:', error);
            message.error('Đã có lỗi xảy ra, vui lòng thử lại!');
        } finally {
           
        }
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <Form className="form"
                name="login"
                layout="vertical"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item className="username"
                    label="Email "
                    name="username"
                    rules={[{ required: true, message: 'Mục này không được bỏ trống!' }]}
                >
                    <Input placeholder="Email " />

                </Form.Item>
                <p>(Ví dụ: yourname@email.com )</p>
                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Mục này không được bỏ trống!' }]}
                >
                    <Input.Password placeholder="Mật khẩu " />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" label={null}>
                    <Checkbox >Nhớ tài khoản</Checkbox>
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Login;