import {
  ExclamationCircleOutlined,
  LeftOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Divider, Dropdown, Menu, Popover, Tooltip, message } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RescheduleModal from "./rescheduleModal";
import {
  DeleteReschedule,
  EditReschedule,
  EditRound,
  GetRescheduleRound,
  Reschedule,
  SingleInterview,
} from "../../services/services";
import DeleteModal from "../../components/common/deleteModal";

function ReScheduleInterview() {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const navigate = useNavigate();
  const [interviewData, setInterviewData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [roundId, setRoundId] = useState(null);
  const [actualDate, setActualDate] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalKey, setModalKey] = useState(null);

  const handleReschedule = async (payload) => {
    payload.userId = location.state.userId;
    payload.recruiterId = location.state.recruiterId;
    payload.roundId = roundId;
    payload.interviewId = location.state._id;
    payload.id = roundId;
    if (!isEdit) {
      payload.actualDate = actualDate;
      const response = await Reschedule(payload);
      if (response.data.success) {
        message.success("Rescheduled Successfully");
        getData(location.state._id);
      } else {
        console.log(response, "error-response");
        message.success("something went wrong");
      }
    } else {
      const response = await EditReschedule(payload);
      if (response.data.success) {
        message.success("Edited successfully");
      } else {
        console.log(response, "error-response");
        message.error("something went wrong");
      }
    }
  };

  const modalHandle = (round, state) => {
    if (state === "Edit") {
      setIsEdit(true);
      getRound(round);
    }
    setActualDate(round?.date);
    setRoundId(round?._id);
    setModalOpen(true);
  };

  const statusHandle = (round, key) => {
    setModal(true);
    setRoundId(round._id);
    if (key === "approve") {
      setModalKey("Approve");
    } else if (key === "reject") {
      setModalKey("Reject");
    }
  };

  const handelModal = (value) => {
    console.log(value, "valu");
    if (modalKey === "Delete") {
      handleDelete(roundId);
    } else {
      const payload = {};
      payload.id = roundId;
      if (modalKey === "Approve") {
        payload.isRescheduled = "false";
        payload.status = "cleared";
        payload.reasonForReject = "";
      } else {
        payload.isRescheduled = "false";
        payload.status = "rejected";
        payload.reasonForReject = value;
      }
      console.log(payload, "payload");
      EditRound(payload).then((res) => {
        if (res.data.success) {
          message.success("Updated successfully");
          getData(location.state._id);
          setModal(false);
        } else {
          console.error(res);
          message.error("something went wrong");
        }
      });
    }
  };

  const handleDelete = (id) => {
    DeleteReschedule(id).then((res) => {
      if (res.data.success) {
        message.success("Deleted successfully");
        getData(location?.state?._id);
        setModal(false);
      } else {
        console.error(res);
        message.success("something went wrong");
      }
    });
  };

  const getRound = (round) => {
    GetRescheduleRound(round?._id).then((res) => {
      if (res) {
        setSelectedData(res?.data?.data);
      } else {
        console.error(res);
      }
    });
  };

  const userMenu = (record) => {
    return record.isRescheduled === "false" ? (
      <Menu>
        <Menu.Item onClick={() => modalHandle(record, "Add")}>
          Reschedule
        </Menu.Item>
      </Menu>
    ) : record.isRescheduled === "pending" ? (
      <Menu>
        <Menu.Item onClick={() => modalHandle(record, "Edit")}>Edit</Menu.Item>
        <Menu.Item
          onClick={() => {
            setRoundId(record?._id);
            setModalKey("Delete");
            setModal(true);
          }}
        >
          Delete
        </Menu.Item>
      </Menu>
    ) : null;
  };

  const statusMenu = (record) => {
    return (
      <Menu>
        <Menu.Item
          disabled={record?.status === "cleared"}
          onClick={() => statusHandle(record, "approve")}
        >
          Make next round
        </Menu.Item>
        <Menu.Item
          disabled={record?.status === "rejected"}
          onClick={() => statusHandle(record, "reject")}
        >
          Reject
        </Menu.Item>
      </Menu>
    );
  };

  const getData = (id) => {
    console.log(id, "id");
    SingleInterview(id).then((res) => {
      setInterviewData(res?.data?.data[0]);
    });
  };

  useEffect(() => {
    if (location.state._id) {
      getData(location.state._id);
    }
  }, [location.state]);

  return (
    <div>
      <DeleteModal
        visible={modal}
        onCancel={() => {
          setModal(false);
        }}
        title="Are you sure"
        confirmButtonText={modalKey}
        confirmButtonClass={
          modalKey === "Approve"
            ? "bg-blue-600 ml-1 text-white"
            : "bg-red-600 ml-1 text-white"
        }
        message={
          modalKey === "Delete"
            ? "you want to delete this?"
            : `you want to ${modalKey?.toLowerCase()}?`
        }
        onOk={handelModal}
        reason={modalKey === "Reject"}
      />
      <RescheduleModal
        currentState={modalOpen}
        setCurrentState={setModalOpen}
        actualDate={actualDate}
        handleReschedule={handleReschedule}
        selectedData={selectedData}
        isEdit={isEdit}
      />
      <div className="flex justify-start">
        <span className="cursor-pointer" onClick={() => navigate(-1)}>
          <LeftOutlined /> Back
        </span>
      </div>
      <div className="mt-3">
        <div className="flex gap-7">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-gray-500">Title</h3>
            <h2 className="text-lg font-medium text-gray-800">
              {interviewData?.title}
            </h2>
          </div>
          <Divider className="h-12" type="vertical" />
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Organization Name
            </h3>
            <h2 className="text-lg font-medium text-gray-800">
              {interviewData?.organizationName}
            </h2>
          </div>
          <Divider className="h-12" type="vertical" />
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Organization Contact
            </h3>
            <h2 className="text-lg font-medium text-gray-800">
              {interviewData?.organizationContact}
            </h2>
          </div>
        </div>
        <div className="mt-5">
          {interviewData?.rounds?.map((round, index) => (
            <div key={index}>
              <Divider orientation="left">
                <span className="text-base text-gray-700">
                  Round {round.roundNumber}
                </span>
              </Divider>
              <div className="grid grid-cols-3 gap-5 md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1">
                <div className="bg-violet-100 p-3 shadow rounded-md">
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <h2 className="text-base text-violet-700 font-semibold">
                        TIMING
                      </h2>
                      {user?.role === "user" ? (
                        <div>
                          {round.isRescheduled === "pending" ? (
                            <Popover
                              color="blue-inverse"
                              content={"Your request is in pending"}
                            >
                              <ExclamationCircleOutlined className="text-purple-700" />
                            </Popover>
                          ) : round.isRescheduled === "approved" ? (
                            <Popover
                              color="blue-inverse"
                              content="Your request is approved!"
                            >
                              <ExclamationCircleOutlined className="text-green-700" />
                            </Popover>
                          ) : round.isRescheduled === "rejected" ? (
                            <Popover
                              color="blue-inverse"
                              content={round?.reasonForDeny}
                            >
                              <ExclamationCircleOutlined className="text-red-700" />
                            </Popover>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                    {user.role === "user" && (
                      <div>
                        {(index === 0 && round.status === "pending") ||
                        (index !== 0 &&
                          interviewData?.rounds[index - 1]?.status ===
                            "cleared") ? (
                          <div>
                            {round.isRescheduled !== "approved" &&
                            round.isRescheduled !== "rejected" ? (
                              <Dropdown
                                overlay={userMenu(round)}
                                trigger={["click"]}
                              >
                                <MoreOutlined
                                  onClick={(e) => e.preventDefault()}
                                />
                              </Dropdown>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 w-11/12 mt-3">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600 font-medium mr-1">
                        Date
                      </span>
                      <span className="text-sm font-medium">
                        {moment(round.date).format("DD/MM/YYYY")}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600 font-medium mr-1">
                        Time
                      </span>
                      <span className="text-sm font-medium">
                        {moment(round.startTime).format("hh:mm A")}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-700 font-medium mr-1">
                        Duration
                      </span>
                      <span className="text-sm font-medium">
                        {round.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-violet-100 p-3 shadow rounded-md">
                  <h2 className="text-base text-violet-700 font-semibold">
                    INTERVIEWER
                  </h2>
                  <div className="grid grid-cols-2 gap-3 w-11/12 mt-3">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 font-medium mr-1">
                        Name
                      </span>
                      <span className="font-medium text-sm">
                        {round.interviewerName || "not applicable"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 font-medium mr-1">
                        Email
                      </span>
                      <span className="font-medium text-sm">
                        {round.interviewerEmail || "not applicable"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 font-medium mr-1">
                        Role
                      </span>
                      <span className="font-medium text-sm">
                        {round.interviewerRole || "not applicable"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-violet-100 p-3 shadow rounded-md">
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <h2 className="text-base text-violet-700 font-semibold">
                        MODE
                      </h2>
                      {round?.status === "cleared" ? (
                        <Tooltip
                          title={
                            user?.role === "user"
                              ? "you are selected"
                              : "User cleared this round"
                          }
                        >
                          <ExclamationCircleOutlined className="text-green-500" />
                        </Tooltip>
                      ) : round?.status === "rejected" ? (
                        <Tooltip
                          title={
                            user?.role === "user"
                              ? "Sorry please try agian!"
                              : "User failed in this round"
                          }
                        >
                          <ExclamationCircleOutlined className="text-red-500" />
                        </Tooltip>
                      ) : null}
                    </div>
                    {user?.role === "recruiter"
                      ? (index === 0 ||
                          interviewData.rounds[index - 1]?.status ===
                            "cleared") && (
                          <div>
                            <Dropdown
                              overlay={statusMenu(round)}
                              trigger={["click"]}
                            >
                              <MoreOutlined
                                onClick={(e) => e.preventDefault()}
                              />
                            </Dropdown>
                          </div>
                        )
                      : null}
                  </div>
                  {round.type === "offline" ? (
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 font-medium mr-1">
                          Type
                        </span>
                        <span className="text-sm font-medium">
                          {round.type}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 font-medium mr-1">
                          Location
                        </span>
                        <span className="text-sm font-medium">
                          {round.location || "not applicable"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 w-11/12 mt-3">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 font-medium mr-1">
                          Type
                        </span>
                        <span className="text-sm font-medium">
                          {round.type}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 font-medium mr-1">
                          Medium
                        </span>
                        <span className="text-sm font-medium">
                          {round.medium || "not applicable"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 font-medium mr-1">
                          Link
                        </span>
                        <span className="text-sm font-medium">
                          {round?.link ? (
                            <a
                              className="text-blue-400 underline"
                              target="_blank"
                              href={`${round?.link}`}
                            >
                              Link
                            </a>
                          ) : (
                            "not applicable"
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReScheduleInterview;
