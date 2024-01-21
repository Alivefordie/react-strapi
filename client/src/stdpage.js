import Stack from "react-bootstrap/Stack";
import axios from "axios";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { Form, Button } from "react-bootstrap";
import axiosConfig from "./axios-intercepter";
import { useNavigate } from "react-router-dom";
function StudentPage() {
	const [listevent, setlistevent] = useState([]);
	const navigate = useNavigate();
	const [puredata, setpuredata] = useState([]);
	const [search, setsearch] = useState("");
	const handleSearch = (e) => {
		e.preventDefault();
		if (search) {
			fetchItems();
		}
	};
	const fetchItems = async () => {
		try {
			console.log("fetch");
			const response = await axios.get(
				"http://localhost:1337/api/events/findbystd"
			);
			if (!search) {
				setpuredata(response.data.data);
			} else {
				const arrsearch = response.data.data.filter((e) => {
					if (e.name.includes(search)) {
						return e;
					}
				});
				setpuredata(arrsearch);
			}
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => {
		const ac = axiosConfig;
		fetchItems();
	}, []);
	useEffect(() => {
		setlistevent(
			puredata.map((d) => (
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
	}, [puredata]);
	return (
		<Stack gap={3}>
			<Form
				onSubmit={handleSearch}
				className="d-flex flex-row-reverse mt-3 me-3"
			>
				<Button type="submit" variant="success">
					Search
				</Button>
				<Form.Control
					onChange={(e) => {
						setsearch(e.target.value);
					}}
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
