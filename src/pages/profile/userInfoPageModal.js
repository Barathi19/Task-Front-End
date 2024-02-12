/* eslint react/display-name:0 */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Form, Input, Select } from "antd";
import PropTypes from "prop-types";

const UserModalInfoPage = forwardRef(({ selectedData, form }, ref) => {
  const user = JSON.parse(localStorage.getItem("user"));
  let data;
  if (selectedData && Object.keys(selectedData).length) {
    data = {
      firstName: selectedData?.firstName,
      lastName: selectedData?.lastName,
      address: selectedData?.User_Info?.address,
      city: selectedData?.User_Info?.city,
      dateOfBirth: selectedData?.User_Info?.dateOfBirth,
      experience: selectedData?.User_Info?.experience,
      mobileno: selectedData?.User_Info?.mobileno,
      gender: selectedData?.User_Info?.gender,
      organizationName: selectedData?.User_Info?.organizationName,
      organizationContact: selectedData?.User_Info?.organizationContact,
    };
    form.setFieldsValue(data);
  }

  useImperativeHandle(ref, () => ({
    goNext: async () => {
      try {
        const result = await form.validateFields();
        return Promise.resolve({ ...result });
      } catch (error) {
        return Promise.reject(error);
      }
    },
  }));

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        className="h-[350px]  overflow-y-auto"
      >
        <div className="flex mt-4 w-full h-20 justify-around">
          <Form.Item
            className="w-1/4 "
            name="firstName"
            label="First Name"
            rules={[
              {
                required: true,
                message: "Please enter your First Name",
              },
            ]}
            normalize={(value) =>
              value && value.charAt(0).toUpperCase() + value.slice(1)
            }
          >
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item
            className="w-1/4"
            name="lastName"
            label="Last Name"
            rules={[
              {
                required: true,
                message: "Please enter your Last Name",
              },
            ]}
            normalize={(value) =>
              value && value.charAt(0).toUpperCase() + value.slice(1)
            }
          >
            <Input placeholder="Last Name" />
          </Form.Item>
          <Form.Item
            className="w-1/4 "
            name="gender"
            label="Gender"
            rules={[
              {
                required: true,
                message: "Please enter your Gender",
              },
            ]}
          >
            <Select
              placeholder="Gender"
              options={[
                {
                  value: "male",
                  label: "Male",
                },
                {
                  value: "female",
                  label: "Female",
                },
              ]}
            />
          </Form.Item>
        </div>
        <div className="flex w-full h-20 justify-around">
          <Form.Item
            className="w-1/4"
            label="Experience"
            name="experience"
            rules={[
              {
                required: true,
                message: "Please enter your Experience",
              },
            ]}
          >
            <Input className="w-full" placeholder="Experience" />
          </Form.Item>
          <Form.Item
            className="w-1/4"
            name="dateOfBirth"
            label="Date of Birth"
            rules={[
              {
                required: true,
                message: "Please enter your Date of Birth",
              },
            ]}
          >
            <Input type="date" className="w-full" placeholder="Date of Birth" />
          </Form.Item>
          <Form.Item
            className="w-1/4"
            name="mobileno"
            label="Mobile"
            rules={[
              {
                required: true,
                message: "Please enter your Mobile",
              },
              {
                pattern: /^[0-9]{10}$/,
                message: "Mobile number must be 10 digits",
              },
            ]}
          >
            <Input placeholder="Mobile Number" maxLength={10} />
          </Form.Item>
        </div>
        <div className="flex w-full h-20 justify-around">
          <Form.Item
            className="w-7/12"
            name="address"
            label="Address"
            rules={[
              {
                required: true,
                message: "Please enter your Address",
              },
            ]}
          >
            <Input placeholder="Address" />
          </Form.Item>
          <Form.Item
            className="w-1/4"
            name="city"
            label="City"
            rules={[
              {
                required: true,
                message: "Please enter your City",
              },
            ]}
            normalize={(value) =>
              value && value.charAt(0).toUpperCase() + value.slice(1)
            }
          >
            <Input placeholder="City" />
          </Form.Item>
        </div>

        {user?.role === "user" ? (
          <div className="flex w-full h-10 px-10">
            <Form.Item className="w-full" name="about" label="About">
              <Input.TextArea className="!resize-none" maxlength="150" />
            </Form.Item>
          </div>
        ) : (
          <div className="flex ml-10 gap-5">
            <Form.Item
              className="w-full"
              name="organizationName"
              label="organizationName"
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="w-full"
              name="organizationContact"
              label="organization Contact"
            >
              <Input />
            </Form.Item>
          </div>
        )}
      </Form>
    </div>
  );
});
UserModalInfoPage.propTypes = {
  selectedData: PropTypes.array.isRequired,
  form: PropTypes.func,
  setUserInfo: PropTypes.func,
  userInfo: PropTypes.object,
};

export default UserModalInfoPage;
