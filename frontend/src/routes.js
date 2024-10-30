import LoginPage from "./components/Login/LoginPage";
import HomePage from "./Pages/HomePage";
import IntentForm from "./components/IntentForm";
import ManageUsers from "./components/ManageUsers";

export const publicRoutes = [
    {
        path: "/",
        Component: LoginPage
    },
    {
        path: "/login",
        Component: LoginPage
    },
    {
        path: "/home",
        Component: HomePage
    },
    {
        path: "/intent",
        Component: IntentForm
    },
    {
        path: "/manage-users",
        Component: ManageUsers
    },
    {
        path: "*",
        Component: LoginPage 
    },
]