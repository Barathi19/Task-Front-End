import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import PropTypes from "prop-types";
import { changePass } from "../../services/services";

const PasswordModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const [passwordMatchError, setPasswordMatchError] = useState(null);
  const authToken = localStorage.getItem("token");

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (values.password === values.confirmPassword) {
          const payload = {
            ...values,
          };
          console.log(payload, "pay");

          changePass(payload, authToken)
            .then((response) => {
              console.log(response, "response");
              if (response?.data?.message === "Success") {
                handleCancel();
                message.success("Password changed successfully!");
              }
            })
            .catch((error) => {
              console.log(error);
              message.error(
                "Error changing password. Please try again.",
                error
              );
            });
        } else {
          setPasswordMatchError("Passwords do not match");
        }
      })
      .catch((errorInfo) => {
        message.error("Validation failed", errorInfo);
      });
  };

  const handleCancel = () => {
    onCancel();
    form.resetFields();
    setPasswordMatchError(null);
  };

  return (
    <Modal
      title="Change Password"
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          className="bg-blue-500"
          onClick={handleOk}
        >
          Submit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter Password" },
            {
              pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
            },
          ]}
        >
          <Input type="password" />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[
            { required: true, message: "Please enter Confirm Password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Passwords do not match");
              },
            }),
          ]}
        >
          <Input type="password" />
        </Form.Item>
        {passwordMatchError && (
          <p style={{ color: "red", marginTop: "-10px" }}>
            {passwordMatchError}
          </p>
        )}
      </Form>
    </Modal>
  );
};

PasswordModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PasswordModal;
