import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLoaderData, useLocation } from "react-router-dom";
import TableWithTanStackQuery from "./TableWithTanstackQuery";
import UsersTable from "./UsersTable";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { axiosInstance } from "../../elements/axios";

const columns: ColumnDef<UserDataType>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "age", header: "Age" },
  { accessorKey: "gender", header: "Gender" },
];

const Users = () => {
  const location = useLocation();
  const data: TotalUsersDataType = useLoaderData() as TotalUsersDataType;

  const fetchData = async (url: string) => {
    const data = (await axiosInstance.get(url)).data as TotalUsersDataType;
    return data;
  };
  // Fetch data once when component mounts
  useEffect(() => {
    const fetchDataOnce = async () => {
      const url = `/users/${location.search}`;
      await fetchData(url);
    };
    fetchDataOnce();
  }, [location.search]);

  const { data: tableData, isFetching } = useQuery({
    queryKey: ["users", location.search],
    queryFn: () => fetchData(`/users/${location.search}`),
    placeholderData: keepPreviousData,
  });
  return (
    <div className="pt-5">
      <Tabs>
        <TabList className={"space-x-4 flex justify-center my-5"}>
          <Tab
            className={"cursor-pointer inline-block p-3 rounded-md border-none"}
          >
            Users Table Without TanStack Query
          </Tab>

          <Tab className={"cursor-pointer inline-block p-3 rounded-md"}>
            Users Table With TanStack Query
          </Tab>
        </TabList>

        <TabPanel>
          <UsersTable
            data={data.data}
            columns={columns}
            totalDataNo={data.count}
          />
        </TabPanel>
        <TabPanel>
          {/* {isFetching && (
            <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
              Loading...
            </p>
          )} */}
          {/* <div className={`${isFetching && "opacity-20 -z-10"}`}> */}
          <div>
            {tableData && (
              <TableWithTanStackQuery
                data={tableData.data}
                columns={columns}
                totalDataNo={tableData.count}
                isDataFetching={isFetching}
              />
            )}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Users;
