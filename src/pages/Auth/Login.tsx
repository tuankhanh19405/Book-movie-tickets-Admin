
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/filmService";

type FieldType = {
    email?: string;
    password?: string;
    remember?: string;

};

const App = () => {
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoading(true);
        try {
            const { email, password } = values;
            const res = await loginUser({ email: email!, password: password! });
            console.log(res.data)
            localStorage.setItem("token", res.data.accessToken);
            localStorage.setItem("user", JSON.stringify(res.data.user.email));
            message.success("Login success!");
            nav("/dashboard")
            console.log(res);
        } catch (error: any) {
            message.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            name="register"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item<FieldType>
                label="Email"
                name="email"
                rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Email is not valid!' },
                ]}
            >
                <Input placeholder="example@email.com" />
            </Form.Item>

            <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[
                    { required: true, message: 'Please input your password!' },
                    { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>


            <Form.Item<FieldType> name="email" valuePropName="checked" label={null}>
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item label={null}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default App;
