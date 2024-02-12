import React, { useEffect, useState } from "react";
import { message } from "antd";
import axios from "axios";
import { BASE_URL } from "../../constant/apiConstant";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profilelist");
    }
  });

  const handlekeyUp = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email: email,
        password: password,
      });
      if (response.data) {
        navigate("/");
        message.success("Login Successfully!");
        const user = JSON.parse(JSON.stringify(response?.data?.data));
        const { token, ...other } = user;
        localStorage.setItem("user", JSON.stringify(other));
        localStorage.setItem("token", token);
      }
      console.log(response, "response");
    } catch (error) {
      message.error("Invalid Credentials");
      console.log(error, "error");
    }
  };

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center pb-16 pt-12 my-20">
      <div className="w-full max-w-sm">
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-semibold leading-6 text-gray-900"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyUp={(e) => handlekeyUp(e)}
            className="mt-2 appearance-none text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-semibold leading-6 text-gray-900"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onKeyUp={(e) => handlekeyUp(e)}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 appearance-none text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200"
            required
          />
        </div>
        <button
          onClick={handleLogin}
          className="inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 w-full"
        >
          <span>Sign in to account</span>
        </button>
        <input type="hidden" name="remember" defaultValue="true" />
        <p className="mt-8 text-center">
          {/* <a href="/password/reset" className="text-sm hover:underline">
            Forgot password?
          </a> */}
        </p>
      </div>
    </div>
  );
}

export default Login;
