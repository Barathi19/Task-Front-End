import React, { useState, useEffect } from "react";
import { toCamelCase } from "../../helper/helper";

const Model = ({ visible, onClose, data, title, onSubmit }) => {
  const [hidden, setHidden] = useState(!visible);
  const [formData, setFormData] = useState({});

  const onHandleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onHandleSubmit = async (e) => {
    if (title.toLowerCase().includes("delete")) {
      onSubmit("Delete", formData);
    } else if (title.toLowerCase().includes("update")) {
      onSubmit("Update", formData);
    } else if (
      title.toLowerCase().includes("create") ||
      title.toLowerCase().includes("add")
    ) {
      e.preventDefault();
      onSubmit("Create", formData);
    }
  };

  useEffect(() => {
    setHidden(!visible);
  }, [visible]);

  return (
    <div>
      {/* Dimmed overlay */}
      {visible && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Main modal */}
      <div
        id="crud-modal"
        tabIndex={-1}
        aria-hidden="true"
        className={`${
          hidden ? "hidden" : ""
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 bottom-0 left-0 z-50 flex items-center justify-center`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="crud-modal"
                onClick={onClose}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <form className="p-4 md:p-5" onSubmit={onHandleSubmit}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                {data.map((item, index) => (
                  <div className="col-span-2" key={index + 1}>
                    <label
                      htmlFor={toCamelCase(item)}
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {item}
                    </label>
                    {/* dynamic render of input fields: */}
                    {toCamelCase(item) === "rounds" ? (
                      <select
                        name={toCamelCase(item)}
                        id={toCamelCase(item)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={formData[toCamelCase(item)] || ""}
                        onChange={onHandleChange}
                        required
                      >
                        {/* Populate the dropdown with 7 numbers */}
                        {[...Array(7)].map((_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={
                          toCamelCase(item) === "password" ? "password" : "text"
                        }
                        name={toCamelCase(item)}
                        id={toCamelCase(item)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder={item}
                        value={formData[toCamelCase(item)] || ""}
                        onChange={onHandleChange}
                        required
                      />
                    )}
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className={`text-white inline-flex items-center ${
                  title.toLowerCase().includes("delete")
                    ? "bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    : "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                } focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
              >
                {/* <svg
                  className="me-1 -ms-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg> */}
                {title}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Model;
