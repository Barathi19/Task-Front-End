import React, { useEffect, useState } from "react";
import { GetUserInterviewSchedule } from "../../services/services";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "antd";

function InterviewPanel() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [interviewData, setInterviewData] = useState([]);

  const getData = () => {
    GetUserInterviewSchedule(user?._id).then((response) => {
      console.log(response, "espo");
      if (response) {
        Array.isArray(response?.data?.data) &&
          setInterviewData(response?.data?.data);
      }
    });
  };
  const isRejected = (rounds) => {
    const rejected = rounds?.find((round) => round?.status === "rejected");
    return rejected;
  };

  const roundsCleared = (rounds) => {
    const cleared = rounds?.filter((round) => round?.status === "cleared");
    return cleared?.length;
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="my-3">
        <h2 className="text-lg font-medium">LIST OF INTERVIEWS</h2>
      </div>
      <div className="w-full mt-5 ml-3">
        {interviewData.length > 0 ? (
          <div className="grid grid-cols-4 gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {interviewData.map((interview, index) => (
              <div
                key={index}
                className="relative bg-purple-100/[0.9] rounded-lg h-46 shadow-md hover:scale-105 transition-all duration-500 object-cover"
              >
                {roundsCleared(interview.rounds) === interview.rounds.length ? (
                  <div className="absolute inset-0 opacity-70 rounded-lg bg-gray-100">
                    <div className="flex justify-end p-3">
                      <span className="text-sm p-1 bg-blue-100/[0.9] rounded border border-green-300 text-green-500 font-semibold">
                        <Tooltip
                          color="cyan-inverse"
                          title={
                            "Waiting for call letter and further updates!!!"
                          }
                        >
                          Cleared <CheckCircleOutlined />
                        </Tooltip>
                      </span>
                    </div>
                  </div>
                ) : isRejected(interview.rounds) ? (
                  <div className="absolute inset-0 opacity-70 rounded-lg bg-gray-100">
                    <div className="flex justify-end p-3">
                      <span className="text-sm p-1 bg-pink-100/[0.9] rounded border border-red-300 text-red-500 font-semibold">
                        <Tooltip
                          color="cyan-inverse"
                          title={
                            isRejected(interview.rounds)?.reasonForReject ||
                            "Sorry you are rejected!"
                          }
                        >
                          Rejected <CloseCircleOutlined />
                        </Tooltip>
                      </span>
                    </div>
                  </div>
                ) : null}
                <div className="p-3 flex flex-col gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">
                      Interview Title
                    </span>
                    <span className="text-base font-semibold">
                      {interview.title}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">
                      Organization Name
                    </span>
                    <span className="text-sm font-medium">
                      {interview.organizationName}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">
                      Rounds Cleared
                    </span>
                    <div>
                      <span className="text-base text-gray-600 font-medium">{`${roundsCleared(
                        interview.rounds
                      )}`}</span>
                      <span className="text-sm font-medium">{`/${interview.rounds.length}`}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mr-3 mb-1 ">
                  <span
                    onClick={() =>
                      navigate(`/interview/${interview._id}`, {
                        state: { ...interview },
                      })
                    }
                    className="text-base px-1 text-green-500 cursor-pointer hover:text-green-700"
                  >
                    <EyeFilled className="mr-1" />
                    View
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No interviews scheduled</div>
        )}
      </div>
    </div>
  );
}

export default InterviewPanel;
