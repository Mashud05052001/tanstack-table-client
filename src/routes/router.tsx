import { createBrowserRouter } from "react-router-dom";
import ErrorElement from "../components/ErrorElement";
import Layout from "../components/Layout";
import Users from "../components/usersTable/Users";
import { axiosInstance as axios } from "../elements/axios";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorElement />,
    children: [
      {
        path: "/",
        element: <Users />,
        loader: async ({ request }) => {
          const url = `/users?${request.url.split("?")[1] || ""}`;
          // console.log(url);
          const res = await axios.get(url);
          return res?.data;
        },
      },
    ],
  },
]);
