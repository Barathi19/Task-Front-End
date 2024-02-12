import React, { useEffect, useState } from "react";
import "../../assets/styles/main.css";
import { Tabs, Empty, Table, Button, message } from "antd";
import { SettingOutlined, PhoneFilled, LeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileAbotPage from "./userAboutPage";
import { GetUser, UpdateUser } from "../../services/services";
import UserModal from "./userModal";
import PasswordModal from "./passwordModal";

function UserProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [userData, setUserData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [passChange, setPassChange] = useState(false);

  console.log(userData, "userData");

  const getUserDetail = async () => {
    if (location.state) {
      const response = await GetUser(location.state?._id);
      if (response.data) {
        setUserData(response?.data?.data);
      }
    } else {
      const response = await GetUser(user._id);
      if (response.data) {
        setUserData(response?.data?.data);
      }
    }
  };
  useEffect(() => {
    getUserDetail();
  }, [location.state]);

  const handleEdit = (modifiedValues, userValues) => {
    const updateValue = {
      ...userValues,
      ...modifiedValues,
      id: userData[0]?._id,
    };
    UpdateUser(updateValue).then((res) => {
      if (res.status === 200) {
        setModalOpen(false);
        message.success("updated successfully");
      } else {
        console.error(res);
        message.error("something went wrong");
      }
    });
  };

  const languageColumns = [
    {
      title: "Language",
      dataIndex: "language",
    },
    {
      title: "Read",
      dataIndex: "read",
    },
    {
      title: "Write",
      dataIndex: "write",
    },
    {
      title: "Speak",
      dataIndex: "speak",
    },
  ];

  const skillColumns = [
    {
      title: "Skill",
      dataIndex: "skill",
    },
    {
      title: "Version",
      dataIndex: "version",
    },
    {
      title: "Experience",
      dataIndex: "year",
      render: (record) => {
        return record?.years === 0 ? (
          <div>{`${record.months} Month`}</div>
        ) : (
          <div>{`${record.years} Year and ${record.months} Month`}</div>
        );
      },
    },
    {
      title: "Proficiency",
      dataIndex: "level",
    },
  ];
  const skillData = userData[0]?.User_Info?.skills;
  const languageData = userData[0]?.User_Info?.languages;
  console.log(skillData, "skillData");
  const datas = [
    {
      key: "1",
      label: <span>About</span>,
      children: (
        <div className="m-5 flex justify-center">
          {userData[0]?.about ? (
            <p className="text-left w-full">
              {" "}
              {`${userData[0]?.User_Info?.about}`}
            </p>
          ) : (
            <Empty
              className="self-center"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <SettingOutlined />
          Skills
        </span>
      ),
      children: (
        <div>
          <div className="m-3">
            <h1 className="mb-3 text-[#555555] text-xl font-bold">Skills</h1>
            {userData[0]?.User_Info?.skills?.length > 0 ? (
              <Table
                columns={skillColumns}
                dataSource={skillData}
                size="small"
                pagination={false}
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
          <div className="m-3">
            <h1 className="my-3 text-[#555555] text-xl font-bold">Languages</h1>
            {userData[0]?.User_Info?.languages?.length > 0 ? (
              <Table
                columns={languageColumns}
                dataSource={languageData}
                size="small"
                pagination={false}
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
        </div>
      ),
    },
  ];
  
  return (
    <div>
      {user?.role !== "user" && (
        <Button
          type="link"
          className="text-black hover:!text-black flex items-center p-0"
          onClick={() => navigate(-1)}
        >
          <LeftOutlined />
          <span className="text-base">Back</span>
        </Button>
      )}

      <div>
        <div className="flex justify-between mt-10 min-[640px]:max-lg:flex-wrap ">
          <div className="mr-10 flex flex-col basis-3/6 min-[640px]:max-lg:basis-full  min-[640px]:max-lg:mr-0  ">
            <div className=" flex flex-col items-center bg-gray-100 rounded-xl">
              <div className="flex flex-col items-center justify-around  bg-neutral-600 w-full relative ">
                <span className="font-bold text-xl max-w-[270px] text-center text-white mt-4">
                  {userData?.length > 0
                    ? `${userData[0].firstName} ${userData[0].lastName}`
                    : "-"}
                </span>
                <span className="mt-2 mb-16 text-base text-white"></span>

                {/* <span className="absolute -bottom-12 profileImg w-[100px] h-[100px]">
                    <ImageViewer url={userData[0]?.profile?.url} />
                  </span> */}
              </div>
              <div className=" w-full flex flex-col justify-center items-center h-36">
                {userData[0]?.User_Info.address && (
                  <span className="mt-16 text-center max-w-sm ">
                    {userData[0]?.User_Info.address}
                  </span>
                )}
                {userData[0]?.User_Info.mobileno && (
                  <span className="mt-5 mb-5">
                    <PhoneFilled className="mr-2 rotate-90" />
                    {userData[0]?.User_Info?.mobileno}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-gray-100 mt-5 mb-5 h-max rounded-xl ">
              <Tabs
                className="flex justify-between "
                tabBarGutter={150}
                centered
                size={"large"}
                defaultActiveKey="1"
                items={datas}
                indicatorSize={(origin) => origin + 60}
              />
            </div>
          </div>
          {userData.length > 0 && (
            <ProfileAbotPage
              userData={userData}
              setModalOpen={setModalOpen}
              loginData={user}
              setPassChange={setPassChange}
            />
          )}
        </div>
      </div>

      <UserModal
        visible={modalOpen}
        onSave={handleEdit}
        onCancel={() => setModalOpen(false)}
        selectedData={userData[0]}
      />
      <PasswordModal
        visible={passChange}
        onCancel={() => setPassChange(false)}
      />
    </div>
  );
}

export default UserProfile;
