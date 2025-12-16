import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import DashboardPage from "../pages/DashboardPage";
import MoviesPage from "../pages/MoviePage";
import UsersPage from "../pages/UserPage";
import SettingsPage from "../pages/SettingPage";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";

const AdminRouter = [{
  path: "/",
  element: <AdminLayout />,
  children: [
    { index: true, element: <Navigate to={"/dashboard"} /> },
    { path: "dashboard", Component: DashboardPage },
    { path: "movies", Component: MoviesPage },
    { path: "users", Component: UsersPage },
    { path: "settings", Component: SettingsPage },
    { path: "register", Component: Register },
    { path: "login", Component: Login },

  ],
},
];

let router = createBrowserRouter(AdminRouter);

const AppRouter = () => {
  return <RouterProvider router={router} />
}

export default AppRouter