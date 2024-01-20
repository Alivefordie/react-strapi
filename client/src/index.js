import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginForm from "./loginform";
import StudentPage from "./stdpage";
import "bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Navbarr from "./components/navbar";
import { Navigate } from "react-router-dom";

console.log(localStorage.getItem("jwttoken"));
console.log(JSON.parse(localStorage.getItem("userinfo")));

const user = JSON.parse(localStorage.getItem("userinfo"));

const router = createBrowserRouter([
	{
		path: "/",
		element:
			user === null ? (
				<Navigate to="/login" replace />
			) : user?.role.name == "student" ? (
				<Navigate to="/student" replace />
			) : (
				<Navigate to="/staff" replace />
			),
	},
	{ path: "/login", element: <LoginForm /> },
	{
		element: <ProtectedRoutes />,
		children: [
			{
				element: <Navbarr />,
				children: [{ path: "/student", element: <StudentPage /> }],
			},
		],
	},
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
