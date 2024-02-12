import { LeftOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Select,
  TimePicker,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreateInterview,
  EditInterview,
  SingleInterview,
} from "../../services/services";
import dayjs from "dayjs";
import moment from "moment";

const roundInitialState = {
  roundNumber: "",
  date: "",
  duration: "",
  type: "",
  location: "",
  medium: "",
  link: "",
  startTime: "",
  interviewerName: "",
  interviewerEmail: "",
  interviewerRole: "",
  note: "",
};

function InterviewSchedule() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [roundDetails, setRoundDetails] = useState([
    {
      roundNumber: "",
      date: "",
      duration: "",
      type: "",
      location: "",
      medium: "",
      link: "",
      startTime: "",
      interviewerName: "",
      interviewerEmail: "",
      interviewerRole: "",
      note: "",
    },
  ]);

  // const getInterviewData = () => {
  //   SingleInterview()
  // }

  useEffect(() => {
    if (
      location.state?.userDetails?.title &&
      location.state?.userDetails?.rounds?.length
    ) {
      setRoundDetails(location.state?.userDetails?.rounds);
      setIsEdit(true);
    }
  }, [location]);

  const handleSubmit = () => {
    let isError;
    const roundetails = roundDetails.map((round, index) => {
      round.roundNumber = index + 1;
      isError = validateForm(round);
      return round;
    });
    console.log(isError, "isError");
    const payload = {};
    if (!isError) {
      form
        .validateFields()
        .then((values) => {
          payload.title = values.title;
          payload.rounds = roundetails;
          payload.recruiterId = location.state?.recruiter?._id;
          payload.userId = location.state?.userDetails?._id;
          console.log(payload, "payload");
          if (!isEdit) {
            handleAddInterview(payload);
          } else {
            payload.id = location.state?.userDetails?._id;
            handleEditInterview(payload);
          }
        })
        .catch((error) => {
          console.log(error);
          message.error("Field should not be empty");
        });
    } else {
      message.error("Field should not be empty");
    }
  };

  const handleEditInterview = (payload) => {
    console.log(payload, "edit-payload");
    EditInterview(payload).then((res) => {
      if (res.data?.success) {
        message.success("Interview Edited");
      } else {
        message.error(res?.response?.data?.message || "something went wrong");
      }
    });
  };

  const handleAddInterview = (payload) => {
    CreateInterview(payload).then((res) => {
      if (res.data?.success) {
        message.success("Interview scheduled");
        form.resetFields();
        setRoundDetails([roundInitialState]);
        navigate(-1);
      } else {
        message.error(res?.response?.data?.message || "something went wrong");
      }
    });
  };

  const validateForm = (formData) => {
    let isErrorForm = false;
    for (const key in formData) {
      if (Object.hasOwnProperty.call(formData, key)) {
        const value = formData[key];
        if (!value) {
          if (
            formData["type"] === "online" &&
            !formData["location"] &&
            formData["medium"] &&
            formData["link"]
          ) {
            isErrorForm = false;
          } else if (
            formData["type"] === "offline" &&
            !formData["medium"] &&
            !formData["link"] &&
            formData["location"]
          ) {
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
      } else if (name === "type" && value === "offline") {
        prevState[index]["link"] = "";
        prevState[index]["medium"] = "";
        prevState[index]["type"] = value;
      } else {
        prevState[index][name] = value;
      }
      return prevState;
    });
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
    <div>
      <div className="flex justify-start">
        <span className="cursor-pointer" onClick={() => navigate(-1)}>
          <LeftOutlined /> Back
        </span>
      </div>
      <div className="m-3">
        <h2 className="text-base font-normal">Schedule Interview</h2>
        <div className="mt-3">
          <Form form={form} layout="vertical">
            <Form.Item
              name="title"
              label="Interview Name"
              className="w-1/4"
              {...config}
            >
              <Input
                placeholder={location.state?.userDetails?.title || ""}
                className="p-2"
              />
            </Form.Item>
          </Form>
          <div className="flex  mt-5 w-full h-10 justify-between">
            <h1 className="mt-0.5 text-base">Number Of Rounds</h1>
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
                  <div key={index} className="flex flex-col mt-4 w-full ">
                    <div>
                      <Divider orientation="left">Round {index + 1}</Divider>
                      {index !== 0 ? (
                        <div className="flex justify-end ">
                          <Button
                            type="primary"
                            size="small"
                            icon={
                              <MinusOutlined style={{ fontSize: "10px" }} />
                            }
                            className="bg-[blue] flex justify-center items-center"
                            onClick={() => handleActions(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : null}
                      <div className="flex w-full justify-between">
                        <div className="flex flex-col w-1/4">
                          <span>Date</span>
                          <DatePicker
                            allowClear={false}
                            className="mt-2 w-4/5"
                            type="date"
                            placeholder={
                              details.date
                                ? moment(details.date).format("DD-MM-YYYY")
                                : "Date"
                            }
                            onChange={(e) => {
                              handleChange(e.toISOString(), "date", index);
                            }}
                          />
                        </div>
                        <div className="flex flex-col w-1/4">
                          <span>Duration</span>
                          <Input
                            className="mt-2 w-4/5"
                            placeholder="Duration"
                            value={details.duration}
                            onChange={(e) => {
                              handleChange(e.target.value, "duration", index);
                            }}
                          />
                        </div>
                        <div className="flex flex-col w-1/4">
                          <span>Type</span>
                          <Select
                            className="w-4/5 mt-2"
                            allowClear
                            value={details.type}
                            placeholder={details.type ? "" : "online"}
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
                            onChange={(value) =>
                              handleChange(value, "type", index)
                            }
                          />
                        </div>
                        {details.type === "offline" ? (
                          <div className="flex flex-col w-1/4">
                            <span>Location</span>
                            <Input
                              className="mt-2 w-4/5"
                              placeholder="Location"
                              value={details.location}
                              type="text"
                              onChange={(e) => {
                                handleChange(e.target.value, "location", index);
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col w-1/4">
                            <span>Medium</span>
                            <Input
                              className="mt-2 w-4/5"
                              placeholder="google meet"
                              value={details.medium}
                              type="text"
                              onChange={(e) => {
                                handleChange(e.target.value, "medium", index);
                              }}
                            />
                          </div>
                        )}
                        <div className="flex flex-col w-1/4">
                          <span>Link</span>
                          <Input
                            className="mt-2 w-4/5"
                            placeholder="Link"
                            type="text"
                            value={details.link}
                            disabled={details.type === "offline"}
                            onChange={(e) => {
                              handleChange(e.target.value, "link", index);
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex w-full mt-5 justify-between">
                        <div className="flex flex-col w-1/4">
                          <span>Start Time</span>
                          <TimePicker
                            className="mt-2 w-4/5"
                            placeholder="Start Time"
                            format={"HH:mm"}
                            value={
                              details.startTime && dayjs(details.startTime)
                            }
                            onChange={(e) => {
                              handleChange(e.toISOString(), "startTime", index);
                            }}
                          />
                        </div>
                        <div className="flex flex-col w-1/4">
                          <span>Interviewer Name</span>
                          <Input
                            className="mt-2 w-4/5"
                            placeholder="Interviewer name"
                            type="text"
                            value={details.interviewerName}
                            onChange={(e) => {
                              handleChange(
                                e.target.value,
                                "interviewerName",
                                index
                              );
                            }}
                          />
                        </div>
                        <div className="flex flex-col w-1/4">
                          <span>Interviewer Email</span>
                          <Input
                            className="mt-2 w-4/5"
                            placeholder="Interviewer Email"
                            type="text"
                            value={details.interviewerEmail}
                            onChange={(e) => {
                              handleChange(
                                e.target.value,
                                "interviewerEmail",
                                index
                              );
                            }}
                          />
                        </div>
                        <div className="flex flex-col w-1/4">
                          <span>Interviewer Role</span>
                          <Input
                            className="mt-2 w-4/5"
                            placeholder="Interviewer Role"
                            type="text"
                            value={details.interviewerRole}
                            onChange={(e) => {
                              handleChange(
                                e.target.value,
                                "interviewerRole",
                                index
                              );
                            }}
                          />
                        </div>
                        <div className="flex flex-col w-1/4">
                          <span>Note</span>
                          <Input
                            className="mt-2 w-4/5"
                            placeholder="note"
                            type="text"
                            value={details.note}
                            onChange={(e) => {
                              handleChange(e.target.value, "note", index);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="flex mt-3 justify-end">
            <Button
              key="add"
              type="primary"
              size="medium"
              className="bg-[#1677FF] text-base w-[100px] text-white hover:!text-white"
              onClick={handleSubmit}
            >
              {isEdit ? "Edit" : "Schedule"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewSchedule;
