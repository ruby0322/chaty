import { Input, Form, Button, Checkbox } from 'antd';

const Login = ({ name, onFinish, onFinishFailed }) => {
  
  return (
    // <Input.Search
    //   size="large"
    //   style={{ width: 300, margin: 50 }}
    //   prefix={<UserOutlined />}
    //   placeholder="Enter your username"
    //   value={username}
    //   onChange={(e) => setUsername(e.target.value)}
    //   enterButton="Sign In"
    //   onSearch={() => onLogin(username)}
    // />
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        username: name
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Sign in / Sign up
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Login
