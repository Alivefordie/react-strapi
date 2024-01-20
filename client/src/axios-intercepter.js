import axios from "axios";

const axiosConfig = axios.interceptors.request.use(
	(request) => {
		console.log("interceptor ", localStorage.getItem("jwttoken"));
		if (localStorage.getItem("jwttoken")) {
			console.log("------set-----");
			axios.defaults.headers.common[
				"Authorization"
			] = `Bearer ${localStorage.getItem("jwttoken")}`;
		}
		return request;
	},
	function (error) {
		return Promise.reject(error);
	},
	{ synchronous: true }
);

export default axiosConfig;
