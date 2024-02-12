/* eslint react/display-name:0 */
import React, {
  useState,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import PropTypes from "prop-types";
import { Input, Select, message, DatePicker, Button } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
const skillInitialState = { skill: "", version: "", year: "", level: "" };
const languageInitialState = {
  language: "",
  read: "",
  write: "",
  speak: "",
};
const UserModalSkillPage = forwardRef(({ user }, ref) => {
  const [skillDetails, setSkillDetails] = useState([]);
  const [languageDetails, setLanguageDetails] = useState([]);
  const updateDetails = () => {
    const userSkill = user?.User_Info?.skills;
    setSkillDetails(Array.isArray(userSkill) ? userSkill : []);
    const userLanguage = user?.languages;
    setLanguageDetails(Array.isArray(userLanguage) ? userLanguage : []);
  };
  const validateSkillForm = (formData) => {
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
  const handleSkillActions = (index) => {
    const isRemove = typeof index === "number";
    setSkillDetails((prev) => {
      const prevState = [...prev];
      if (isRemove) {
        prevState.splice(index, 1);
      } else {
        const isError = validateSkillForm(prevState.at(-1));
        if (!isError) {
          prevState.push(skillInitialState);
        } else {
          message.error("Field should not be empty");
        }
      }
      return prevState;
    });
  };
  const handleSkillChange = (value, name, index) => {
    setSkillDetails((prev) => {
      const prevState = JSON.parse(JSON.stringify(prev));
      prevState[index][name] = value;
      return prevState;
    });
  };
  const validateLanguageForm = (formData) => {
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
    let expYear = skillDetails.map((val, i) => {
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
    setSkillDetails(expYear);
  };
  const disabledDate = (current) => {
    return current > dayjs().endOf("day");
  };
  const handleLanguageActions = (index) => {
    const isRemove = typeof index === "number";
    setLanguageDetails((prev) => {
      const prevState = [...prev];
      if (isRemove) {
        prevState.splice(index, 1);
      } else {
        const isError = validateLanguageForm(prevState.at(-1));
        if (!isError) {
          prevState.push(languageInitialState);
        } else {
          message.error("Field should not be empty");
        }
      }
      return prevState;
    });
  };
  const handleLanguageChange = (value, name, index) => {
    setLanguageDetails((prev) => {
      const prevState = JSON.parse(JSON.stringify(prev));
      prevState[index][name] = value;
      return prevState;
    });
  };
  useEffect(() => {
    updateDetails();
  }, [user]);
  useImperativeHandle(ref, () => ({
    goNext: () => {
      return new Promise((resolve, reject) => {
        const isError =
          validateLanguageForm(languageDetails.at(-1)) ||
          validateSkillForm(skillDetails.at(-1));
        if (isError) {
          reject("Field should not be empty");
        } else {
          resolve({ skills: skillDetails, languages: languageDetails });
        }
      });
    },
  }));
  return (
    <div className="h-[350px]  overflow-y-auto">
      <div className="flex  mt-5 w-full h-8 justify-between align-middle">
        <h1 className="mt-0 text-xl">Skills</h1>
        <Button
          type="primary"
          icon={<PlusCircleOutlined style={{ fontSize: "20px" }} />}
          className="bg-[blue] flex justify-center items-center"
          onClick={handleSkillActions}
        >
          Add Skills
        </Button>
      </div>
      <div>
        {skillDetails &&
          skillDetails.length > 0 &&
          skillDetails.map((details, index) => {
            const rangePickerValue = Array.isArray(details?.year?.value)
              ? details.year.value.map((range) => dayjs(range))
              : [];
            return (
              <div
                key={index}
                className="flex mt-4 w-full h-16 justify-between"
              >
                <div className="w-1/5">
                  <span>Skill / Software name</span>
                  <Input
                    className=" mt-2"
                    placeholder="Skill"
                    value={details.skill}
                    onChange={(e) =>
                      handleSkillChange(e.target.value, "skill", index)
                    }
                  />
                </div>
                <div className="w-1/5 ">
                  <span>Software version</span>
                  <Input
                    className=" mt-2"
                    placeholder="Software version"
                    value={details.version}
                    onChange={(e) =>
                      handleSkillChange(e.target.value, "version", index)
                    }
                  />
                </div>

                <div className="w-1/5">
                  <span>Experience</span>
                  <RangePicker
                    className="mt-2 w-full"
                    picker="month"
                    onChange={(dates) =>
                      handleExpYearChange(dates, "year", index)
                    }
                    value={rangePickerValue}
                    disabledDate={disabledDate}
                  />
                </div>
                <div className="w-1/5">
                  <span>Proficiency</span>
                  <Select
                    className="w-full mt-2"
                    value={details.level}
                    allowClear
                    options={[
                      {
                        value: "beginner",
                        label: "Beginner",
                      },
                      {
                        value: "intermediate",
                        label: "Intermediate",
                      },
                      {
                        value: "expert",
                        label: "Expert",
                      },
                    ]}
                    onChange={(e) => handleSkillChange(e, "level", index)}
                  />
                </div>
                <div className="flex self-end">
                  <Button
                    type="primary"
                    icon={<MinusCircleOutlined style={{ fontSize: "20px" }} />}
                    className="bg-[blue] flex justify-center items-center"
                    onClick={() => handleSkillActions(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            );
          })}
      </div>

      <div className="flex mt-10 w-full h-8 justify-between">
        <h1 className=" text-xl">Languages</h1>
        <Button
          type="primary"
          icon={<PlusCircleOutlined style={{ fontSize: "20px" }} />}
          className="bg-[blue] flex justify-center items-center"
          onClick={handleLanguageActions}
        >
          Add Languages
        </Button>
      </div>
      <div>
        {languageDetails &&
          languageDetails.length > 0 &&
          languageDetails.map((details, index) => {
            return (
              <div
                key={index}
                className="flex mt-4 w-full h-16 justify-between"
              >
                <div className="w-1/5">
                  <span>Language</span>
                  <Input
                    className="mt-2"
                    placeholder="language"
                    value={details.language}
                    onChange={(e) =>
                      handleLanguageChange(e.target.value, "language", index)
                    }
                  />
                </div>
                <div className="w-24">
                  <span>Read</span>
                  <Select
                    className="w-full mt-2"
                    value={details.read}
                    allowClear
                    options={[
                      {
                        value: "yes",
                        label: "Yes",
                      },
                      {
                        value: "no",
                        label: "No",
                      },
                    ]}
                    onChange={(e) => handleLanguageChange(e, "read", index)}
                  />
                </div>
                <div className="w-24" label="Write">
                  <span>Write</span>
                  <Select
                    className="w-full mt-2"
                    value={details.write}
                    allowClear
                    options={[
                      {
                        value: "yes",
                        label: "Yes",
                      },
                      {
                        value: "no",
                        label: "No",
                      },
                    ]}
                    onChange={(e) => handleLanguageChange(e, "write", index)}
                  />
                </div>

                <div className="w-24">
                  <span>Speak</span>
                  <Select
                    className="w-full mt-2"
                    value={details.speak}
                    allowClear
                    options={[
                      {
                        value: "yes",
                        label: "Yes",
                      },
                      {
                        value: "no",
                        label: "No",
                      },
                    ]}
                    onChange={(e) => handleLanguageChange(e, "speak", index)}
                  />
                </div>

                <div className="flex self-end">
                  <Button
                    type="primary"
                    icon={<MinusCircleOutlined style={{ fontSize: "20px" }} />}
                    className="bg-[blue] flex justify-center items-center"
                    onClick={() => handleLanguageActions(index)}
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
UserModalSkillPage.propTypes = {
  user: PropTypes.array.isRequired,
};
export default UserModalSkillPage;
