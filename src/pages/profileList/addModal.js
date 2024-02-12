import React from "react";
import { Modal, Form, Button, Input, message, Select } from "antd";
import PropTypes from "prop-types";

function AddModal({ currentState, setCurrentState, handleAdd }) {
  const [form] = Form.useForm();

  const handleModalSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        handleAdd(values);
        form.resetFields();
        closeModal();
      })
      .catch((error) => {
        console.log(error);
        message.error("Please fill the required fields");
      });
  };

  const handleCancel = () => {
    closeModal();
    form.resetFields();
  };

  const closeModal = () => {
    setCurrentState(false);
    form.resetFields();
  };

  const footerContent = (
    <div className="flex justify-end space-x-4">
      <Button
        size="large"
        key="cancel"
        className="text-base"
        onClick={handleCancel}
      >
        Cancel
      </Button>

      <Button
        key="add"
        size="large"
        type="primary"
        className="bg-[#1677FF] text-base text-white hover:!text-white"
        onClick={handleModalSubmit}
      >
        Add
      </Button>
    </div>
  );

  const config = {
    rules: [
      {
        required: true,
        message: "Please fill out this field",
      },
    ],
  };
  return (
    <Modal
      title={"Add User"}
      centered
      open={currentState}
      onCancel={handleCancel}
      footer={footerContent}
      className="max-h-[500px] overflow-y-auto"
    >
      <Form form={form} layout="vertical ">
        <Form.Item name="firstName" label="First Name" {...config}>
          <Input className="p-2" />
        </Form.Item>
        <Form.Item name="lastName" label="Last Name" {...config}>
          <Input className="p-2" />
        </Form.Item>
        <Form.Item name="email" label="Email" {...config}>
          <Input className="p-2" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

AddModal.propTypes = {
  currentState: PropTypes.bool,
  setCurrentState: PropTypes.func,
  handleAdd: PropTypes.func,
};

export default AddModal;
