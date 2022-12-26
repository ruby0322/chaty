import { Form, Input, Modal, Select } from 'antd';

const ChatModal = ({ open, onCreate, onCancel, friends, }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title="Create a new group to chat w/ friends!"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch(e => { console.log('Input Error'); });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: 'Error: Please enter the name of the person to chat!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="members"
          label="Members"
          rules={[
            {
              required: true,
              message: 'Error: Select at least one friend to the group!',
            },
          ]}
        >
          <Select
            mode='multiple'
            allowClear
            style={{
              width: '100%',
            }}
            placeholder='Add friends to group'
            // defaultValue={[]}
            // onChange={handleChange}
            options={friends}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChatModal;