import React, { useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import type { FormProps } from "antd";
import { registerFilms } from "../../services/filmService";
import { useNavigate } from "react-router-dom";

type FieldType = {
    email?: string;
    password?: string;
    confirmPassword?: string;
    remember?: boolean;
};

const App: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoading(true);
        try {
            const { email, password } = values;
            const res = await registerFilms({ email: email!, password: password! });
            message.success("Register success!");
            nav("/login")
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

            <Form.Item<FieldType>
                label="Confirm Password"
                name="confirmPassword"
                dependencies={['password']}
                hasFeedback
                rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(
                                new Error('The two passwords that you entered do not match!')
                            );
                        },
                    }),
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
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
