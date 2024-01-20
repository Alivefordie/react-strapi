import Stack from "react-bootstrap/Stack";
import axios from "axios";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { Form, Button } from "react-bootstrap";
import "./std.module.css";
import axiosConfig from "./axios-intercepter";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function StudentPage() {
	const [listevent, setlistevent] = useState([]);
	const navigate = useNavigate();
	const fetchItems = async () => {
		try {
			const ac = axiosConfig;
			console.log("fetch");
			const response = await axios.get(
				"http://localhost:1337/api/events/findbystd"
			);
			setlistevent(
				response.data.data.map((d) => (
					<Card
						border="info"
						bg="dark"
						className="w-75 mx-auto text-white"
						key={d.id}
						slug={d.slug}
						onClick={() => navigate(`/student/${d.slug}`)}
						style={{ cursor: "pointer" }}
					>
						<Card.Header style={{ fontSize: "30px" }}>
							{d.name}
						</Card.Header>
						<Card.Body className="border border-info">
							<Card.Text>{d.description}</Card.Text>
						</Card.Body>
					</Card>
				))
			);
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => {
		fetchItems();
	}, []);
	return (
		<Stack gap={3}>
			<Form className="d-flex flex-row-reverse mt-3 me-3">
				<Button variant="success">Search</Button>
				<Form.Control
					type="search"
					placeholder="Search"
					className="w-25 me-2"
					aria-label="Search"
				/>
			</Form>
			{listevent}
		</Stack>
	);
}
export default StudentPage;
