import { useLoaderData } from "react-router-dom";
import UsersTable from "./UsersTable";
import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<UsersDataType>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "age", header: "Age" },
  { accessorKey: "gender", header: "Gender" },
];

const Users = () => {
  const data: TotalUsersDataType = useLoaderData() as TotalUsersDataType;
  return (
    <div className="pt-5">
      <UsersTable data={data.data} columns={columns} totalDataNo={data.count} />
    </div>
  );
};

export default Users;
