import React from "react";
import { Space, Empty, Button } from "antd";
import PropTypes from "prop-types";
import { EditOutlined, LockOutlined } from "@ant-design/icons";

function ProfileAbotPage({ userData, setModalOpen, loginData, setPassChange }) {
  return (
    <div className="bg-gray-100 basis-full min-h-[475px] h-max mb-5 p-5 rounded-xl">
      <div className="flex justify-between">
        <span className=" text-[#555555] text-xl font-bold">About</span>
        {loginData._id === userData[0]?._id ? (
          <div>
            <Button
              className="border-blue-500 mr-1"
              icon={<LockOutlined className="text-blue-500" />}
              onClick={() => setPassChange(true)}
            >
              <span className="text-blue-500">Change Password</span>
            </Button>
            <Button
              type="primary"
              className="bg-blue-500"
              icon={<EditOutlined />}
              onClick={() => {
                setModalOpen(true);
                console.log(1234);
              }}
            >
              Edit
            </Button>
          </div>
        ) : null}
      </div>
      <div className=" flex justify-between mt-5 ">
        <Space direction="vertical">
          <span className="font-bold text-[#555555]">Full Name</span>
          <span>
            {userData?.length > 0
              ? `${userData[0].firstName} ${userData[0].lastName}`
              : "-"}
          </span>
        </Space>
        <Space direction="vertical">
          <span className="font-bold text-[#555555]">Mobile</span>
          <span>{userData[0]?.mobile ? `${userData[0].mobile}` : "-"}</span>
        </Space>
        <Space direction="vertical">
          <span className="font-bold text-[#555555]">Email</span>
          <span>{userData[0]?.email ? `${userData[0].email}` : "-"}</span>
        </Space>
        <Space direction="vertical">
          <span className="font-bold text-[#555555]">City</span>
          <span>
            {userData[0]?.User_Info.city
              ? `${userData[0]?.User_Info.city}`
              : "-"}
          </span>
        </Space>
      </div>
      <p className="mt-10 text-[#555555] text-xl font-bold">Education</p>
      <Space.Compact
        direction="vertical"
        className="mt-5 w-full justify-center"
      >
        {userData[0]?.User_Info.education?.length > 0 ? (
          userData[0]?.User_Info.education.map((detail, index) => {
            if (detail.regulation === "UG" || detail.regulation === "Other") {
              return (
                <span
                  key={index}
                >{`${detail.course} ${detail.specialization} board at ${detail.boardName} with a  ${detail.mark} CGPA in ${detail.year}`}</span>
              );
            } else {
              return (
                <span
                  key={index}
                >{`${detail.regulation} board at ${detail.boardName} with a  ${detail.mark} Percentage in ${detail.year}`}</span>
              );
            }
          })
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Space.Compact>
      <p className="mt-10 text-[#555555] text-xl font-bold">Experience</p>
      <Space.Compact
        direction="vertical"
        className="mt-5 w-full justify-center"
      >
        {userData[0]?.User_Info.experienceDetails?.length > 0 ? (
          userData[0]?.User_Info.experienceDetails.map((detail, index) => {
            if (detail.year.years === 0) {
              return (
                <span
                  key={index}
                >{`${detail.year.months} Month Experience in ${detail.designation} in the Organisation ${detail.details}`}</span>
              );
            } else {
              return (
                <span
                  key={index}
                >{`${detail.year.years} Year and ${detail.year.months} Month Experience in ${detail.designation} in the Organisation ${detail.details}`}</span>
              );
            }
          })
        ) : (
          <Empty className="mt-9" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Space.Compact>
    </div>
  );
}
ProfileAbotPage.propTypes = {
  userData: PropTypes.array,
  setModalOpen: PropTypes.func,
  loginData: PropTypes.object,
  setPassChange: PropTypes.func,
};
export default ProfileAbotPage;
