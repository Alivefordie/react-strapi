import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginForm from "./loginform";
import StudentPage from "./stdpage";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Navbarr from "./components/navbar";
import { Navigate } from "react-router-dom";
import Eventdetail from "./eventdetail";
import Staffpage from "./staff";
import Evendtstaff from "./eventDTstaff";
import { useState } from "react";
function App() {
	const [login, setlogin] = useState(false);
	const router = createBrowserRouter([
		{
			path: "/",
			element: !login && <Navigate to="/login" replace />,
		},
		{ path: "/login", element: <LoginForm /> },
		{
			element: <ProtectedRoutes />,
			children: [
				{
					element: <Navbarr />,
					children: [
						{ path: "/student", element: <StudentPage /> },
						{ path: "/staff", element: <Staffpage /> },
						{ path: "/student/:slug", element: <Eventdetail /> },
						{ path: "/staff/:slug", element: <Evendtstaff /> },
						{ path: "*", element: <h1>error</h1> },
					],
				},
			],
		},
	]);
	return <RouterProvider router={router} />;
}

export default App;
