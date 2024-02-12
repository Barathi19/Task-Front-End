import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Steps, message, Form } from "antd";
import { useRef } from "react";
import UserModalInfoPage from "./userInfoPageModal";
import UserModalEduPage from "./userEduPageModal";
import UserModalSkillPage from "./userSkillPageModal";
import UserModalExpPage from "./userExpPageModal";

const UserModal = ({ visible, onSave, onCancel, selectedData, isLoading }) => {
  const [user, setuser] = useState(null);
  const [form] = Form.useForm();
  const userEducationDetailsPageReferance = useRef(null);
  const userSkillDetailsPageReferance = useRef(null);
  const userDetailsPageReferance = useRef(null);
  const userExpDetailsPageReferance = useRef(null);
  const resetView = () => {
    setCurrent(0);
  };

  const handleOk = () => {
    const referance = current === 3 ? userExpDetailsPageReferance : null;
    referance?.current
      ?.goNext()
      .then((values) => {
        onSave(values, user, resetView);
        setuser((prev) => ({ ...prev, ...values }));
      })
      .catch(() => {
        message.error("Field should not be empty");
      });
  };

  const handleCancel = () => {
    onCancel();
    setCurrent(0);
    form.resetFields();
  };
  const [current, setCurrent] = useState(0);
  const next = () => {
    const referance =
      current === 0
        ? userDetailsPageReferance
        : current === 1
        ? userEducationDetailsPageReferance
        : current === 2
        ? userSkillDetailsPageReferance
        : userExpDetailsPageReferance;

    referance?.current
      ?.goNext()
      .then((values) => {
        setuser((prev) => ({ ...prev, ...values }));
        setCurrent(current + 1);
      })
      .catch(() => {
        message.error("Field should not be empty");
      });
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const steps = [
    {
      title: "User Detail",
      content: (
        <UserModalInfoPage
          selectedData={user}
          ref={userDetailsPageReferance}
          form={form}
        />
      ),
    },
    {
      title: "Education",
      content: (
        <UserModalEduPage user={user} ref={userEducationDetailsPageReferance} />
      ),
    },
    {
      title: "Skills",
      content: (
        <UserModalSkillPage user={user} ref={userSkillDetailsPageReferance} />
      ),
    },
    {
      title: "Experience",
      content: (
        <UserModalExpPage user={user} ref={userExpDetailsPageReferance} />
      ),
    },
  ];
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const footerContent = (
    <div className="mt-5 pr-10 w-full flex justify-end">
      {current > 0 && (
        <Button className="mx-3 my-0" onClick={() => prev()}>
          Previous
        </Button>
      )}
      {current < steps.length - 1 && (
        <Button
          type="primary"
          className="bg-blue-600 text-white"
          onClick={() => next()}
        >
          Next
        </Button>
      )}
      {current === steps.length - 1 && (
        <Button
          type="primary"
          className="text-white bg-blue-600"
          onClick={handleOk}
          loading={isLoading}
        >
          Save
        </Button>
      )}
    </div>
  );
  useEffect(() => {
    if (selectedData && Object.keys(selectedData).length > 0 && !user) {
      const { firstName, lastName, _id, ...User_Info } = selectedData;
      const data = { firstName, lastName, ...User_Info };
      setuser(data);
    }
  }, [selectedData]);

  return (
    <Modal
      title="user"
      open={visible}
      onCancel={handleCancel}
      width={1000}
      footer={footerContent}
    >
      <Steps current={current} items={items} />
      <div>{steps[current].content}</div>
    </Modal>
  );
};
UserModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  selectedData: PropTypes.object,
  isLoading: PropTypes.bool,
};
export default UserModal;
