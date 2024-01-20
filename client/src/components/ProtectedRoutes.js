import React from "react";

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
	const localStorageToken = localStorage.getItem("jwttoken");
	return localStorageToken ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoutes;
