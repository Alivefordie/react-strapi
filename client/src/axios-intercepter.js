import axios from "axios";

const axiosConfig = axios.interceptors.request.use(
	(request) => {
		console.log(localStorage.getItem("jwttoken"));
		if (localStorage.getItem("jwttoken")) {
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
