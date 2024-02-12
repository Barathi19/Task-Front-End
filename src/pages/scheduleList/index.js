import { Dropdown, Menu, Table, Tooltip, message } from "antd";
import React, { useEffect, useState } from "react";
import { ExclamationCircleOutlined, MoreOutlined } from "@ant-design/icons";
import { DeleteInterview, GetScheduleData } from "../../services/services";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../../components/common/deleteModal";

function ScheduleList() {
  const [scheduleData, setScheduleData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [interviewId, setInterviewId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const getInterviewData = () => {
    GetScheduleData(user?._id).then((res) => {
      setScheduleData(res);
    });
  };

  useEffect(() => {
    getInterviewData();
  }, []);

  const handleDelete = async () => {
    await DeleteInterview(interviewId)
      .then((res) => {
        if (res?.data?.success) {
          message.success(res?.data?.message);
          setDeleteModal(false);
          getInterviewData();
        } else {
          message.error(res?.data?.error || "something went wrong");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const menu = (record) => (
    <Menu>
      <Menu.Item
        onClick={() =>
          navigate(`/schedulelist/view/${record._id}`, { state: { ...record } })
        }
      >
        View
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          navigate(`/schedulelist/edit/${record._id}`, {
            state: { recruiter: { ...user }, userDetails: { ...record } },
          })
        }
      >
        Edit
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setInterviewId(record._id);
          setDeleteModal(true);
        }}
      >
        Delete
      </Menu.Item>
    </Menu>
  );
  const column = [
    {
      title: "Name",
      dataIndex: "firstName",
      render: (firstName, record) => {
        let isCleared = record?.rounds?.filter(
          (round) => round.status === "cleared"
        );
        isCleared = isCleared?.length === record?.rounds?.length;
        const name = `${firstName} ${record.lastName}`;
        let isRejected = record?.rounds?.some(
          (round) => round.status === "rejected"
        );
        return (
          <div className="flex gap-3">
            <span>{name}</span>
            {isCleared ? (
              <Tooltip
                color="blue-inverse"
                title={"User already cleared this interview!"}
              >
                <ExclamationCircleOutlined className="text-green-500" />
              </Tooltip>
            ) : isRejected ? (
              <Tooltip color="blue-inverse" title={"User already terminated!"}>
                <ExclamationCircleOutlined className="text-red-500" />
              </Tooltip>
            ) : null}
          </div>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Experience",
      dataIndex: "experience",
    },
    {
      title: "Interview",
      dataIndex: "title",
    },
    {
      title: "Number Of Rounds",
      dataIndex: "rounds",
      render: (rounds) => rounds?.length,
    },
    {
      title: "Action",
      render: (_, record) => {
        return (
          <div>
            <Dropdown overlay={menu(record)} trigger={["click"]}>
              <MoreOutlined onClick={(e) => e.preventDefault()} />
            </Dropdown>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="ml-5 mt-5 text-xl">LIST OF SCHEDULES</div>
      <div className="flex justify-end items-center">
        {/* <Button icon={<PlusOutlined />} type="primary" className="bg-orange-500 hover:!bg-orange-600 -mt-8" onClick={()=> handleCreateSchedule()}>
          Create Schedule
        </Button> */}
      </div>
      <div>
        <Table
          columns={column}
          dataSource={scheduleData}
          scroll={{ x: 300 }}
          className="mt-5"
          pagination={{ pageSize: 7 }}
        />
      </div>
      <div>
        <DeleteModal
          title="Are you sure"
          message="You want to delete this interview"
          visible={deleteModal}
          onOk={handleDelete}
          onCancel={() => setDeleteModal(false)}
        />
      </div>
    </div>
  );
}

export default ScheduleList;
