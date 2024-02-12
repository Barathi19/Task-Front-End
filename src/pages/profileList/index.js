import { Button, Dropdown, Menu, Table, Tag, Tooltip, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../constant/apiConstant";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import DeleteModal from "../../components/common/deleteModal";
import { DeleteUser, RegisterUser } from "../../services/services";
import AddModal from "./addModal";
import { useNavigate } from "react-router-dom";
import ProfileDataTable from "./profileDatatable";

function ProfileList() {
  const [userData, setUserData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const authToken = localStorage.getItem("token");
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user`);
      if (response?.data && Array.isArray(response.data?.data)) {
        const filterData = response?.data?.data?.filter(
          (d) => d?.role === "user"
        );
        setUserData(filterData);
      }
    } catch (error) {
      console.error(error, "error");
    }
  };

  const handleDelete = async () => {
    await DeleteUser(deleteId)
      .then((res) => {
        console.log(res, "res");
        if (res?.data?.success) {
          message.success(res?.data?.message);
          setDeleteModal(false);
          getUser();
        } else {
          message.error(res?.data?.data?.error || "something went wrong");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleAdd = (values) => {
    values.role = "user";
    RegisterUser(values, authToken)
      .then(() => {
        message.success("User added successfully");
        getUser();
      })
      .catch((error) => {
        console.log(error);
        message.error("Something went wrong");
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  const menu = (record) => (
    <Menu>
      <Menu.Item
        onClick={() =>
          navigate(`/profilelist/${record._id}`, { state: { ...record } })
        }
        key="View"
      >
        View
      </Menu.Item>
      {user.role === "recruiter" && (
        <Menu.Item
          onClick={() => {
            navigate(`/profilelist/createinterview/${record._id}`, {
              state: { recruiter: { ...user }, userDetails: { ...record } },
            });
          }}
        >
          Create
        </Menu.Item>
      )}
      {user.role === "admin" && (
        <Menu.Item
          onClick={() => {
            setDeleteModal(true);
            setDeleteId(record._id);
          }}
          key="Delete"
        >
          Delete
        </Menu.Item>
      )}
      {user.role === "admin" && (
        <Menu.Item>
          {record.isActive ? "Make Inactive" : "Make Active"}
        </Menu.Item>
      )}
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
      title: "Technology",
      dataIndex: "User_Info",
      render: (User_Info) => {
        return User_Info?.skills?.length < 3 ? (
          <div className="flex gap-1">
            {User_Info?.skills?.map((skill) => {
              return (
                <Tooltip title={skill?.skill}>
                  <span className="h-4 w-4 p-3 bg-red-300 rounded-full flex justify-center items-center text-sm font-medium">
                    {skill?.skill?.charAt(0)?.toUpperCase()}
                  </span>
                </Tooltip>
              );
            })}
          </div>
        ) : (
          <div className="flex gap-3">
            <div className="flex gap-1">
              {User_Info?.skills?.slice(0, 3).map((skill) => {
                return (
                  <Tooltip title={skill?.skill}>
                    <span className="h-4 w-4 p-3 bg-red-300 rounded-full flex justify-center items-center text-sm font-medium">
                      {skill?.skill?.charAt(0)?.toUpperCase()}
                    </span>
                  </Tooltip>
                );
              })}
            </div>
            <span className="font-medium">
              +{User_Info?.skills?.length - 3} more
            </span>
          </div>
        );
      },
    },
    {
      title: "Experience",
      dataIndex: "User_Info",
      render: (User_Info) => User_Info.experience || "-",
    },
    {
      title: "Mobile",
      dataIndex: "User_Info",
      render: (User_Info) => User_Info.mobileno || "-",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (status) => (
        <Tag color={status ? "green" : "purple"}>
          {status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      render: (_, userData) => {
        return (
          <div>
            <Dropdown overlay={menu(userData)} trigger={["click"]}>
              <MoreOutlined onClick={(e) => e.preventDefault()} />
            </Dropdown>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="ml-5 mt-5 text-xl">LIST OF PROFILES</div>
      {user.role === "admin" && (
        <div className="flex justify-end items-center">
          <Button
            icon={<PlusOutlined />}
            type="primary"
            className="bg-blue-500 hover:!bg-blue-600 -mt-8"
            onClick={() => setAddModal(true)}
          >
            Add User
          </Button>
        </div>
      )}
      <div>
        <ProfileDataTable column={column} tableData={userData} />
      </div>
      <div>
        <AddModal
          currentState={addModal}
          handleAdd={handleAdd}
          setCurrentState={setAddModal}
        />
      </div>
      <div>
        <DeleteModal
          title="Are you sure"
          message="You want to delete this user"
          visible={deleteModal}
          onOk={handleDelete}
          onCancel={() => setDeleteModal(false)}
        />
      </div>
    </div>
  );
}

export default ProfileList;
