import React, { useState } from "react";
import { Modal, Form, Button, Input, message, Select, DatePicker } from "antd";
import PropTypes from "prop-types";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

const roundInitialState = {
  roundNumber: "",
  date: "",
  duration: "",
  type: "",
  location: "",
};

function ScheduleModal({ currentState, setCurrentState, handleAdd }) {
  const [form] = Form.useForm();

  const handleModalSubmit = () => {
    let isError;
    roundDetails.map((round) => {
      isError = validateForm(round);
    });
    console.log(isError, "isError");
    const payload = {};
    if (!isError) {
      form.validateFields().then((values) => {
        payload.title = values.title;
        payload.rounds = roundDetails;
        console.log(payload, "payload");
        handleAdd(payload);
      });
    } else {
      message.error("Field should not be empty");
    }
  };

  const handleCancel = () => {
    closeModal();
    form.resetFields();
  };

  const closeModal = () => {
    setCurrentState(false);
    setRoundDetails([]);
    form.resetFields();
  };

  const footerContent = (
    <div className="flex justify-end space-x-4">
      <Button
        size="large"
        key="cancel"
        className="text-base w-1/2"
        onClick={handleCancel}
      >
        Cancel
      </Button>

      <Button
        key="add"
        type="primary"
        size="large"
        className="bg-[#1677FF] text-base w-1/2 text-white hover:!text-white"
        onClick={handleModalSubmit}
      >
        Add
      </Button>
    </div>
  );
  const [roundDetails, setRoundDetails] = useState([]);

  const validateForm = (formData) => {
    let isErrorForm = false;
    for (const key in formData) {
      if (Object.hasOwnProperty.call(formData, key)) {
        const value = formData[key];
        if (!value) {
          if (formData["type"] === "online" && !formData["location"]) {
            isErrorForm = false;
          } else {
            isErrorForm = true;
          }
        }
      }
    }
    return isErrorForm;
  };

  const handleActions = (index) => {
    const isRemove = typeof index === "number";
    setRoundDetails((prev) => {
      const prevState = [...prev];
      if (isRemove) {
        prevState.splice(index, 1);
      } else {
        const isError = validateForm(prevState.at(-1));
        if (!isError) {
          prevState.push(roundInitialState);
        } else {
          message.error("Field should not be empty");
        }
      }
      return prevState;
    });
  };

  const handleChange = (value, name, index) => {
    setRoundDetails((prev) => {
      const prevState = JSON.parse(JSON.stringify(prev));
      if (name === "type" && value === "online") {
        prevState[index]["location"] = "";
        prevState[index]["type"] = value;
      } else {
        prevState[index][name] = value;
      }
      return prevState;
    });
    console.log(roundDetails, "roundetails");
  };
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
      title={"Schedule Interview"}
      centered
      open={currentState}
      onCancel={handleCancel}
      footer={footerContent}
      className="max-h-[500px] overflow-y-auto min-w-[780px]"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Title" {...config}>
          <Input className="p-2" />
        </Form.Item>
      </Form>
      <div className="flex  mt-5 w-full h-10 justify-between">
        <h1 className="mt-0.5 text-xl">Rounds</h1>
        <Button
          type="primary"
          icon={<PlusOutlined style={{ fontSize: "15px" }} />}
          className="bg-[blue] flex justify-center items-center"
          onClick={handleActions}
        >
          Add
        </Button>
      </div>
      <div>
        {roundDetails &&
          roundDetails.length > 0 &&
          roundDetails?.map((details, index) => {
            return (
              <div
                key={index}
                className="flex mt-4 w-full h-16 justify-between"
              >
                <div className="w-1/5">
                  <span>RoundNumber</span>
                  <Input
                    className="mt-2"
                    placeholder="RoundNumber"
                    onChange={(e) => {
                      handleChange(e.target.value, "roundNumber", index);
                    }}
                  />
                </div>
                <div className="w-1/6">
                  <span>Date</span>
                  <DatePicker
                    className="mt-2"
                    placeholder="Date"
                    onChange={(e) => {
                      handleChange(e.toISOString(), "date", index);
                    }}
                  />
                </div>
                <div className="w-[80px]">
                  <span>Duration</span>
                  <Input
                    className="mt-2"
                    placeholder="Duration"
                    onChange={(e) => {
                      handleChange(e.target.value, "duration", index);
                    }}
                  />
                </div>
                <div className="w-[80px]">
                  <span>Type</span>
                  <Select
                    className="w-full mt-2"
                    allowClear
                    options={[
                      {
                        label: "offline",
                        value: "offline",
                      },
                      {
                        value: "online",
                        label: "online",
                      },
                    ]}
                    onChange={(value) => handleChange(value, "type", index)}
                  />
                </div>
                {details.type === "offline" ? (
                  <div className="w-1/5">
                    <span className="mb-5">Location</span>
                    <Input
                      className="mt-2"
                      placeholder="Location"
                      type="text"
                      value={details.year}
                      onChange={(e) => {
                        handleChange(e.target.value, "location", index);
                      }}
                    />
                  </div>
                ) : null}
                <div className="flex self-end ">
                  <Button
                    type="primary"
                    icon={<MinusOutlined style={{ fontSize: "15px" }} />}
                    className="bg-[blue] flex justify-center items-center"
                    onClick={() => handleActions(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            );
          })}
      </div>
    </Modal>
  );
}

ScheduleModal.propTypes = {
  currentState: PropTypes.bool,
  setCurrentState: PropTypes.func,
  handleAdd: PropTypes.func,
};

export default ScheduleModal;
