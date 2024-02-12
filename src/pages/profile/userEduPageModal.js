/* eslint react/display-name:0 */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Button, Input, Select, message } from "antd";
import PropTypes from "prop-types";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
const eduInitialState = {
  regulation: "",
  boardName: "",
  course: "",
  specialization: "",
  mark: "",
  year: "",
};

const UserModalEduPage = forwardRef(({ user }, ref) => {
  const [educationDetails, setEducationDetails] = useState([]);

  const updateEduDetails = () => {
    const userEducation = user?.User_Info?.education;
    setEducationDetails(Array.isArray(userEducation) ? userEducation : []);
  };

  const validateForm = (formData) => {
    let isErrorForm = false;
    for (const key in formData) {
      if (Object.hasOwnProperty.call(formData, key)) {
        if (
          !(
            (formData.regulation === "10th" ||
              formData.regulation === "12th") &&
            (key === "course" || key === "specialization")
          )
        ) {
          const value = formData[key];
          if (!value) {
            isErrorForm = true;
          }
        }
      }
    }
    return isErrorForm;
  };

  const handleActions = (index) => {
    const isRemove = typeof index === "number";
    setEducationDetails((prev) => {
      const prevState = [...prev];
      if (isRemove) {
        prevState.splice(index, 1);
      } else {
        const isError = validateForm(prevState.at(-1));
        if (!isError) {
          prevState.push(eduInitialState);
        } else {
          message.error("Field should not be empty");
        }
      }
      return prevState;
    });
  };

  const handleChange = (value, name, index) => {
    setEducationDetails((prev) => {
      const prevState = JSON.parse(JSON.stringify(prev));
      prevState[index][name] = value;
      return prevState;
    });
  };

  useEffect(() => {
    updateEduDetails();
  }, [user]);

  useImperativeHandle(ref, () => ({
    goNext: () => {
      return new Promise((resolve, reject) => {
        const isError = validateForm(educationDetails.at(-1));
        if (isError) {
          reject("Field should not be empty");
        } else {
          resolve({ education: educationDetails });
        }
      });
    },
  }));

  return (
    <div className="h-[350px]  overflow-y-auto">
      <div className="flex  mt-5 w-full h-10 justify-between">
        <h1 className="mt-0.5 text-xl">Education</h1>
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
        {educationDetails &&
          educationDetails.length > 0 &&
          educationDetails?.map((details, index) => {
            return (
              <div
                key={index}
                className="flex mt-4 w-full h-16 justify-between"
              >
                <div className="w-[80px]">
                  <span>Regulations</span>
                  <Select
                    className="w-full mt-2"
                    value={details.regulation}
                    allowClear
                    options={[
                      {
                        value: "10th",
                        label: "10th",
                      },
                      {
                        value: "12th",
                        label: "12th",
                      },
                      {
                        value: "UG",
                        label: "UG",
                      },
                      {
                        value: "Other",
                        label: "Other",
                      },
                    ]}
                    onChange={(value) =>
                      handleChange(value, "regulation", index)
                    }
                  />
                </div>
                <div className="w-1/5">
                  <span>University/Institute</span>
                  <Input
                    className="mt-2"
                    placeholder="University/Institute"
                    value={details.boardName}
                    onChange={(e) => {
                      handleChange(e.target.value, "boardName", index);
                    }}
                  />
                </div>
                {details.regulation === "UG" ||
                details.regulation === "Other" ? (
                  <div className="w-1/6">
                    <span>Course</span>
                    <Input
                      className="mt-2"
                      placeholder="Course"
                      value={details.course}
                      onChange={(e) => {
                        handleChange(e.target.value, "course", index);
                      }}
                    />
                  </div>
                ) : null}
                {details.regulation === "UG" ||
                details.regulation === "Other" ? (
                  <div className="w-1/6">
                    <span>Specialization</span>
                    <Input
                      className="mt-2"
                      placeholder="Specialization"
                      value={details.specialization}
                      onChange={(e) => {
                        handleChange(e.target.value, "specialization", index);
                      }}
                    />
                  </div>
                ) : null}
                <div className="w-[80px]">
                  <span>Grade</span>
                  <Input
                    className="mt-2"
                    placeholder="%"
                    type="number"
                    value={details.mark}
                    onChange={(e) => {
                      handleChange(e.target.value, "mark", index);
                    }}
                  />
                </div>
                <div className="w-[80px]">
                  <span className="mb-5">Year</span>
                  <Input
                    className="mt-2"
                    placeholder="Year"
                    type="number"
                    value={details.year}
                    onChange={(e) => {
                      handleChange(e.target.value, "year", index);
                    }}
                  />
                </div>
                <div className="flex self-end ">
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
UserModalEduPage.propTypes = {
  user: PropTypes.object.isRequired,
};
export default UserModalEduPage;
