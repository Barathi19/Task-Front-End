import { Button, DatePicker, Form, Input, Modal, message } from "antd";
import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";

function RescheduleModal({
  currentState,
  setCurrentState,
  actualDate,
  handleReschedule,
  selectedData,
  isEdit,
}) {
  const [form] = Form.useForm();

  if (selectedData && Object.keys(selectedData).length) {
    selectedData.rescheduledDate = dayjs(selectedData?.rescheduledDate);
    form.setFieldsValue(selectedData);
  }

  const handleModalSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {};
        payload.rescheduledDate = values.rescheduledDate;
        payload.reason = values.reason;
        handleReschedule(payload);
        handleCancel();
      })
      .catch((err) => {
        console.log(err, "err");
        message.error("Please fill the required data");
      });
  };
  const handleCancel = () => {
    setCurrentState(false);
    form.resetFields();
  };
  const config = {
    rules: [
      {
        required: true,
        message: "Please fill out this field",
      },
    ],
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
        {isEdit ? "Edit" : "Add"}
      </Button>
    </div>
  );
  return (
    <Modal
      title="Reschedule Interview"
      centered
      open={currentState}
      onCancel={handleCancel}
      footer={footerContent}
    >
      <div className="mt-3">
        <Form form={form} layout="vertical">
          <Form.Item>
            <DatePicker disabled value={moment(actualDate)} />
          </Form.Item>
          <Form.Item
            name="rescheduledDate"
            label="Rescheduled Date"
            {...config}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item name="reason" label="Reason" {...config}>
            <TextArea />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

RescheduleModal.propTypes = {
  currentState: PropTypes.bool,
  setCurrentState: PropTypes.func,
  actualDate: PropTypes.string,
  handleReschedule: PropTypes.func,
  selectedData: PropTypes.object,
  isEdit: PropTypes.bool,
};

export default RescheduleModal;
