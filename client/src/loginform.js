import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const LoginForm = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState("stdb");
	const [password, setPassword] = useState("123456");
	const [submitEnabled, setSubmitEnabled] = useState(true);
	const handleUsernameChange = (e) => {
		setUsername(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};
	useEffect(() => {
		console.log("asas");
		delete axios.defaults.headers.common["Authorization"];
	}, []);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitEnabled(false);
		try {
			const result = await axios.post(
				"http://localhost:1337/api/auth/local",
				{
					identifier: username,
					password: password,
				}
			);
			localStorage.setItem("jwttoken", result.data.jwt);
			const result2 = await axios.get(
				"http://localhost:1337/api/users/me?populate=role",
				{ headers: { Authorization: `Bearer ${result.data.jwt}` } }
			);
			localStorage.setItem("userinfo", JSON.stringify(result2.data));
			if (result2.data.role) {
				if (result2.data.role.name == "student") {
					navigate("/student");
				}
				if (result2.data.role.name == "staff") {
					navigate("/staff");
				}
			}
		} catch (e) {
			delete axios.defaults.headers.common["Authorization"];
			localStorage.removeItem("userinfo");
			localStorage.removeItem("jwttoken");
			setSubmitEnabled(true);
		}
	};
	return (
		<Form onSubmit={handleSubmit}>
			<Form.Group controlId="formBasicUsername">
				<Form.Label>Username: </Form.Label>
				<Form.Control
					type="text"
					placeholder="Enter username"
					value={username}
					onChange={handleUsernameChange}
					required
				/>
			</Form.Group>

			<Form.Group controlId="formBasicPassword">
				<Form.Label>Password: </Form.Label>
				<Form.Control
					type="password"
					placeholder="Password"
					value={password}
					onChange={handlePasswordChange}
					required
				/>
			</Form.Group>
			<Button variant="primary" type="submit" disabled={!submitEnabled}>
				Submit
			</Button>
		</Form>
	);
};

export default LoginForm;
