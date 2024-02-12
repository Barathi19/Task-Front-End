import axios from "axios";
import { BASE_URL } from "../constant/apiConstant";

const RegisterUser = async (data, authToken) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error making POST request:", error);
    return error;
  }
};

const DeleteUser = async (id) => {
  console.log(id);
  try {
    const response = await axios.delete(`${BASE_URL}/user/${id}`);
    return response;
  } catch (error) {
    console.error("Error making POST request:", error);
    return error;
  }
};

const GetRescheduleData = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/interview/rescheduledata/${id}`
    );
    let data = [];
    if (response.data) {
      data = Array.isArray(response?.data?.data) ? response?.data?.data : [];
      console.log(data, "data");
    }
    return data;
  } catch (error) {
    console.log(error, "error");
    return error;
  }
};

const GetScheduleData = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/interview/scheduledata/${id}`
    );
    let data = [];
    if (response.data) {
      data = Array.isArray(response?.data?.data) ? response?.data?.data : [];
      console.log(data, "data");
    }
    return data;
  } catch (error) {
    console.log(error, "error");
    return error;
  }
};

const CreateInterview = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/interview`, payload);
    console.log(response, "response");
    return response;
  } catch (error) {
    console.log(error, "error");
    return error;
  }
};

const GetUserInterviewSchedule = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/interview/${id}`);
    console.log(response, "response");
    return response;
  } catch (error) {
    console.log(error, "error");
    return error;
  }
};

const GetUser = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/${id}`);
    console.log(response, "response");
    return response;
  } catch (error) {
    console.log(error, "error");
    return error;
  }
};

const Reschedule = async (payload) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/interview/reschedule`,
      payload
    );
    return response;
  } catch (error) {
    console.log(error, "error");
    return error;
  }
};

const UpdateUser = async (payload) => {
  const { id, ...body } = payload;
  try {
    const response = await axios.put(`${BASE_URL}/user/${id}`, body);
    console.log(response, "res");
    return response;
  } catch (error) {
    console.log(error, "error");
    return error;
  }
};

const EditInterview = async (payload) => {
  const { id, ...body } = payload;
  try {
    const response = await axios.put(`${BASE_URL}/interview/${id}`, body);
    console.log(response, "response");
    return response;
  } catch (error) {
    console.log(error, "error");
    return error;
  }
};

const DeleteInterview = async (id) => {
  console.log(id);
  try {
    const response = await axios.delete(`${BASE_URL}/interview/${id}`);
    return response;
  } catch (error) {
    console.error("error:", error);
    return error;
  }
};

const GetRescheduleRound = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/round/${id}`);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const DeleteReschedule = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/round/${id}`);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const EditReschedule = async (payload) => {
  const { id, ...body } = payload;
  try {
    const response = await axios.put(`${BASE_URL}/round/${id}`, body);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const EditRound = async (payload) => {
  const { id, ...body } = payload;
  try {
    const response = await axios.put(`${BASE_URL}/round/status/${id}`, body);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const SingleInterview = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/interview/userinterview/${id}`
    );
    return response;
  } catch (error) {
    return error;
  }
};

const changePass = async (payload, authToken) => {
  console.log(payload, authToken);
  try {
    const response = await axios.put(`${BASE_URL}/user`, payload, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export {
  RegisterUser,
  DeleteUser,
  GetRescheduleData,
  GetScheduleData,
  CreateInterview,
  GetUserInterviewSchedule,
  GetUser,
  Reschedule,
  UpdateUser,
  EditInterview,
  DeleteInterview,
  GetRescheduleRound,
  DeleteReschedule,
  EditReschedule,
  EditRound,
  SingleInterview,
  changePass,
};
