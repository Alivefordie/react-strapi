import Stack from "react-bootstrap/Stack";
import axios from "axios";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { Form, Button } from "react-bootstrap";
import "./std.module.css";
import axiosConfig from "./axios-intercepter";

function StudentPage() {
	const [listevent, setlistevent] = useState([]);
	const fetchItems = async () => {
		try {
			console.log("fetch");
			const response = await axios.get(
				"http://localhost:1337/api/events/findbystd"
			);
			setlistevent(
				response.data.data.map((d) => (
					<Card
						bg="secondary"
						className="w-75 mx-auto text-white"
						key={d.id}
					>
						<Card.Header>{d.name}</Card.Header>
						<Card.Body>
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
		//document.body.style.background = "linear-gradient(to top, blue, red)";
		//"linear-gradient(to bottom right,#7708ae,#6c0850,#b14861 )";
		fetchItems();
	}, []);
	return (
		<Stack gap={3}>
			<Form className="d-flex flex-row-reverse mt-3 me-3">
				<Button variant="outline-success">Search</Button>
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
