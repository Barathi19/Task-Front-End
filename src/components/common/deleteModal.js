import React from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, message } from "antd";
import TextArea from "antd/es/input/TextArea";

const popup = message;

const DeleteModal = ({
  visible,
  onOk,
  onCancel,
  message,
  isLoading,
  title,
  width = 300,
  confirmButtonText = "Delete",
  confirmButtonClass = "bg-red-600 ml-1 text-white",
  reason,
}) => {
  const [form] = Form.useForm();
  const handleSubmit = () => {
    if (reason) {
      form
        .validateFields()
        .then((values) => {
          onOk(values.reason);
        })
        .catch((err) => {
          console.log(err);
          popup.error("Fill the reason");
        });
    } else {
      onOk();
    }
  };
  const footerContent = (
    <div className="mt-3">
      <Button onClick={onCancel}>Cancel</Button>
      <Button
        type="primary"
        className={confirmButtonClass}
        onClick={() => handleSubmit()}
        loading={isLoading}
      >
        {confirmButtonText}
      </Button>
    </div>
  );
  return (
    <Modal
      className="w-5"
      title={title}
      width={width}
      onOk={handleSubmit}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      visible={visible}
      centered
      footer={footerContent}
    >
      <div className="flex flex-col">
        {message && <p>{message}</p>}
        {reason && (
          <Form form={form} layout="vertical">
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please enter the reason",
                },
              ]}
              className="mt-2"
              name="reason"
              label="Reason"
            >
              <TextArea />
            </Form.Item>
          </Form>
        )}
      </div>
    </Modal>
  );
};

DeleteModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  message: PropTypes.string,
  title: PropTypes.string.isRequired,
  width: PropTypes.number,
  confirmButtonText: PropTypes.string,
  confirmButtonClass: PropTypes.string,
  reason: PropTypes.bool,
};
export default DeleteModal;
