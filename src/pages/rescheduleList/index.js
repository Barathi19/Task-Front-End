import React, { useEffect, useState } from "react";
import {
  DeleteReschedule,
  EditRound,
  GetRescheduleData,
} from "../../services/services";
import { Dropdown, Menu, Table, Tag, message } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import moment from "moment";
import DeleteModal from "../../components/common/deleteModal";

function RescheduleList() {
  const [rescheduleData, setRescheduleData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [modal, setModal] = useState(false);
  const [modalKey, setModalKey] = useState("");
  const [selectedData, setSelectedData] = useState(null);

  const getData = () => {
    GetRescheduleData(user?._id).then((res) => {
      setRescheduleData(res);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleMenuItemClick = (key, record) => {
    setSelectedData(record);
    if (key === "approve") {
      setModalKey("Approve");
    } else if (key === "deny") {
      setModalKey("Deny");
    } else {
      setModalKey("Delete");
    }
    setModal(true);
  };

  const handleModal = (value) => {
    const payload = {};
    payload.id = selectedData?.roundId;
    if (modalKey === "Approve" || modalKey === "Deny") {
      if (modalKey === "Approve") {
        payload.isRescheduled = "approved";
        payload.date = selectedData.rescheduledDate;
        payload.approved = "approved";
      } else {
        payload.isRescheduled = "rejected";
        payload.date = selectedData?.actualDate;
        payload.approved = "rejected";
        payload.reasonForDeny = value;
      }
      EditRound(payload).then((res) => {
        if (res.data) {
          message.success("updated successfully");
          getData();
        } else {
          console.log(res, "err-res");
          message.error("something went wrong");
        }
        setModal(false);
      });
    } else {
      DeleteReschedule(selectedData?._id)
        .then((res) => {
          if (res?.data?.success) {
            message.success(res?.data?.message);
            getData();
          } else {
            message.error(res?.data?.error || "something went wrong");
          }
        })
        .catch((err) => {
          console.error(err);
        });
      setModal(false);
    }
  };

  const menu = (record) => (
    <Menu>
      <Menu.Item onClick={() => handleMenuItemClick("approve", record)}>
        Approve
      </Menu.Item>
      <Menu.Item onClick={() => handleMenuItemClick("deny", record)}>
        Deny
      </Menu.Item>
      {record.approved === "rejected" ? (
        <Menu.Item
          onClick={() => {
            handleMenuItemClick("delete");
          }}
        >
          Delete
        </Menu.Item>
      ) : null}
    </Menu>
  );
  const column = [
    {
      title: "Name",
      dataIndex: "firstName",
      render: (firstName, record) => {
        const name = `${firstName} ${record.lastName}`;
        return name;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobileno",
    },
    {
      title: "Round",
      dataIndex: "roundNumber",
    },
    {
      title: "Actual Date",
      dataIndex: "actualDate",
      render: (date) => `${moment(date).format("DD/MM/YYYY")}`,
    },
    {
      title: "Rescheduled Date",
      dataIndex: "rescheduledDate",
      render: (date) => `${moment(date).format("DD/MM/YYYY")}`,
    },
    {
      title: "Reason",
      dataIndex: "reason",
    },
    {
      title: "Approval",
      dataIndex: "approved",
      render: (approved) => {
        let color =
          approved === "pending"
            ? "purple"
            : approved === "approved"
            ? "green"
            : "red";
        return (
          <Tag color={color} className="p-1">
            {approved}
          </Tag>
        );
      },
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
      <DeleteModal
        title="Are you sure"
        message="You want to delete this data"
        visible={modal}
        onOk={handleModal}
        onCancel={() => {
          setModal(false);
        }}
        confirmButtonText={modalKey}
        reason={modalKey === "Deny"}
        confirmButtonClass={`bg-${
          modalKey === "Approve" ? "blue" : "red"
        }-600 ml-1 text-white`}
      />
      <div className="ml-5 mt-5 text-xl">LIST OF SCHEDULES</div>
      <div>
        <Table
          columns={column}
          dataSource={rescheduleData?.map((data) => ({
            ...data,
            key: data._id,
          }))}
          scroll={{ x: 300 }}
          className="mt-5"
          pagination={{ pageSize: 7 }}
        />
      </div>
    </div>
  );
}

export default RescheduleList;
