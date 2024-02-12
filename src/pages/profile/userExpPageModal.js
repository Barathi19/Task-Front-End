/* eslint react/display-name:0 */
import React, {
  useState,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import { Input, Space, DatePicker, message, Button } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import dayjs from "dayjs";

const expInitialState = {
  year: { value: "", years: "", months: "" },
  designation: "",
  details: "",
};

const UserModalExpPage = forwardRef(({ user }, ref) => {
  const [expDetails, setExpDetails] = useState([]);
  const updateExpDetails = () => {
    const userExperience = user?.User_Info.experience;
    setExpDetails(Array.isArray(userExperience) ? userExperience : []);
  };

  const { RangePicker } = DatePicker;
  const handleExpYearChange = (dates, field, index) => {
    const startDate = dates && new Date(dates[0]);
    const endDate = dates && new Date(dates[1]);
    let experienceYears = endDate?.getFullYear() - startDate?.getFullYear();
    let experienceMonths = endDate?.getMonth() - startDate?.getMonth();
    if (experienceMonths < 0) {
      experienceYears -= 1;
      experienceMonths += 12;
    }
    let newDate = [startDate, endDate];
    let expYear = expDetails.map((val, i) => {
      return i === index
        ? {
            ...val,
            [field]: {
              value: newDate,
              years: experienceYears,
              months: experienceMonths,
            },
          }
        : val;
    });
    setExpDetails(expYear);
  };

  const disabledDate = (current) => {
    return current > dayjs().endOf("day");
  };

  const handleExpChange = (value, name, index) => {
    setExpDetails((prev) => {
      const prevState = JSON.parse(JSON.stringify(prev));
      prevState[index][name] = value;
      return prevState;
    });
  };
  const validateForm = (formData) => {
    let isErrorForm = false;
    for (const key in formData) {
      if (Object.hasOwnProperty.call(formData, key)) {
        const value = formData[key];
        if (!value) {
          isErrorForm = true;
        }
      }
    }
    return isErrorForm;
  };
  const handleActions = (index) => {
    const isRemove = typeof index === "number";
    setExpDetails((prev) => {
      const prevState = [...prev];
      if (isRemove) {
        prevState.splice(index, 1);
      } else {
        const isError = validateForm(prevState.at(-1));
        if (!isError) {
          prevState.push(expInitialState);
        } else {
          message.error("Field should not be empty");
        }
      }
      return prevState;
    });
  };

  useEffect(() => {
    updateExpDetails();
  }, [user]);

  useImperativeHandle(ref, () => ({
    goNext: () => {
      return new Promise((resolve, reject) => {
        const isError = validateForm(expDetails.at(-1));
        if (isError) {
          reject("Field should not be empty");
        } else {
          resolve({ experienceDetails: expDetails });
        }
      });
    },
  }));
  return (
    <div className="h-[350px]  overflow-y-auto">
      <div className="flex mt-10 w-full h-8 justify-between">
        <h1 className="text-xl">Experience</h1>
        <Button
          type="primary"
          icon={<PlusCircleOutlined style={{ fontSize: "20px" }} />}
          className="bg-[blue] flex justify-center items-center"
          onClick={handleActions}
        >
          Add
        </Button>
      </div>
      <div>
        {expDetails &&
          expDetails.length > 0 &&
          expDetails.map((details, index) => {
            const rangePickerValue = Array.isArray(details?.year?.value)
              ? details.year.value.map((range) => dayjs(range))
              : [];
            return (
              <div
                key={index}
                className="flex mt-4 w-full h-16 justify-between"
              >
                <div className="w-1/3 ">
                  <span>Year</span>
                  <Space className="w-full mt-2" direction="vertical" size={12}>
                    <RangePicker
                      picker="month"
                      onChange={(dates) =>
                        handleExpYearChange(dates, "year", index)
                      }
                      value={rangePickerValue}
                      disabledDate={disabledDate}
                    />
                  </Space>
                </div>
                <div className="w-1/5 ">
                  <span>Designation</span>
                  <Input
                    className="mt-2"
                    placeholder="Designation"
                    value={details.designation}
                    onChange={(e) =>
                      handleExpChange(e.target.value, "designation", index)
                    }
                  />
                </div>
                <div className="w-1/3">
                  <span>Company Name</span>
                  <Input
                    className="mt-2"
                    placeholder="Company Name"
                    value={details.details}
                    onChange={(e) =>
                      handleExpChange(e.target.value, "details", index)
                    }
                  />
                </div>
                <div className="flex self-end">
                  <Button
                    type="primary"
                    icon={<MinusCircleOutlined style={{ fontSize: "20px" }} />}
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
    </div>
  );
});
UserModalExpPage.propTypes = {
  user: PropTypes.array.isRequired,
};
export default UserModalExpPage;
