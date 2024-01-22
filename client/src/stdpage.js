import Stack from "react-bootstrap/Stack";
import axios from "axios";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { Form, Button } from "react-bootstrap";
import axiosConfig from "./axios-intercepter";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
function StudentPage() {
	const [listevent, setlistevent] = useState([]);
	const navigate = useNavigate();
	const [geterror, seterror] = useState({});
	const [loadind, setloading] = useState(false);
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
			const response = await axios.get(
				"http://localhost:1337/api/events/findbystd"
			);
			seterror(null);
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
			setloading(false);
		} catch (err) {
			console.log(err);
			if (err.response?.data) {
				seterror(err.response.data.error);
			} else {
				seterror(err);
			}
			setloading(false);
		}
	};
	useEffect(() => {
		setloading(true);
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
		<>
			{loadind ? (
				<Spinner
					className="position-absolute top-50 start-50"
					style={{
						width: "10rem",
						height: "10rem",
						borderWidth: "1rem",
					}}
					size="lg"
					animation="border"
					variant="light"
				/>
			) : geterror ? (
				<>
					<h1>status : {geterror.status}</h1>
					<h1>name :{geterror.name}</h1>
					<h1>message : {geterror.message}</h1>
				</>
			) : (
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
			)}
		</>
	);
}
export default StudentPage;
