import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <div data-theme="light" className="min-h-screen">
    <RouterProvider router={router} />
  </div>
);
