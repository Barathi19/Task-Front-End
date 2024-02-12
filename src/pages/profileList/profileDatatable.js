import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Input, Select, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";

function ProfileDataTable({ rowKey, column, tableData }) {
  const [inputValue, setInputValue] = useState({
    field: "firstName",
    value: "",
  });
  const [filteredData, setFilteredData] = useState(null);

  //   const globalSearch = () => {
  //     console.log(tableData);
  //     const filtered = tableData?.filter((item) => {
  //       console.log(item, "item");
  //       return Object.values(item?.User_Info?.skills)?.some((value) => {
  //         console.log(value, "val");
  //         value?.toString().toLowerCase().includes(inputValue.toLowerCase());
  //       });
  //     });
  //     setFilteredData(filtered);
  //   };
  const tableSearch = () => {
    const filtered =
      inputValue.field === "technology"
        ? tableData?.filter((item) => {
            return item?.User_Info?.skills?.some((skill) =>
              skill?.skill
                .toLowerCase()
                .includes(inputValue.value.toLowerCase())
            );
          })
        : inputValue.field === "experience"
        ? tableData?.filter((item) => {
            return item?.User_Info?.experience
              ?.toLowerCase()
              .includes(inputValue.value.toLowerCase());
          })
        : tableData?.filter((item) => {
            return item[inputValue.field]
              .toLowerCase()
              .includes(inputValue.value.toLowerCase());
          });
    setFilteredData(filtered);
  };

  useEffect(() => {
    console.log(tableData);
    tableSearch();
  }, [inputValue, tableData]);

  const handleSearch = (e) => {
    setInputValue((prev) => ({ ...prev, value: e.target.value }));
  };

  return (
    <section>
      <Table
        columns={column}
        dataSource={filteredData}
        scroll={{ x: 200 }}
        className="mt-5"
        pagination={{ pageSize: 7 }}
        rowKey={rowKey}
        title={() => {
          return (
            <div className="flex justify-between">
              <span className="text-xl font-thicker">Users</span>
              <div className="flex justify-between">
                <Input
                  size="large"
                  className="mx-3 "
                  placeholder="Search"
                  prefix={<SearchOutlined />}
                  value={inputValue.value}
                  onChange={(e) => handleSearch(e)}
                />
                <Select
                  defaultValue="firstName"
                  style={{ width: 120 }}
                  onChange={(value) =>
                    setInputValue((prev) => ({ ...prev, field: value }))
                  }
                  options={[
                    { value: "firstName", label: "Name" },
                    { value: "email", label: "Email" },
                    { value: "technology", label: "Technology" },
                    { value: "experience", label: "Experience" },
                  ]}
                  size="large"
                />
              </div>
            </div>
          );
        }}
      />
    </section>
  );
}

ProfileDataTable.propTypes = {
  rowKey: PropTypes.any,
  column: PropTypes.array,
  tableData: PropTypes.array,
};

export default ProfileDataTable;
