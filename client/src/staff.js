import axios from "axios";
import axiosConfig from "./axios-intercepter";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Stack, Spinner, Card, Badge } from "react-bootstrap";
import Createmodal from "./components/createModal";
function Staffpage() {
	const [show, setShow] = useState(false);
	const [puredata, setpuredata] = useState([]);
	const [search, setsearch] = useState("");
	const navigate = useNavigate();
	const [geterror, seterror] = useState({});
	const [loadind, setloading] = useState(false);
	const er = (
		<>
			<h1>status : {geterror?.status}</h1>
			<h1>name :{geterror?.name}</h1>
			<h1>message : {geterror?.message}</h1>
		</>
	);
	const handleSearch = (e) => {
		e.preventDefault();
		if (search) {
			fetchItems();
		}
	};
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const fetchItems = async () => {
		try {
			const response = await axios.get("http://localhost:1337/api/events");
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
				if (geterror) {
					seterror(err.response.data.error);
				}
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
				er
			) : (
				<Stack gap={3}>
					<div className="d-flex justify-content-around w-100 mt-3">
						<Button
							style={{ marginLeft: "5px" }}
							variant="primary"
							className="d-flex p-1 "
							onClick={handleShow}>
							Create
						</Button>
						<div className="invisible"></div>
						<Form onSubmit={handleSearch} className="d-flex flex-row-reverse">
							<Button type="submit" variant="success">
								Search
							</Button>
							<Form.Control
								onChange={(e) => {
									setsearch(e.target.value);
								}}
								type="search"
								placeholder="Search"
								className="w-100 me-2"
								aria-label="Search"
							/>
						</Form>
					</div>
					{puredata.map((d) => (
						<Card
							border="info"
							bg="dark"
							className="w-75 mx-auto text-white"
							key={d.id}
							slug={d.slug}
							onClick={() => navigate(`/staff/${d.slug}`)}
							style={{ cursor: "pointer" }}>
							<Card.Header className="d-flex justify-content-between" style={{ fontSize: "30px" }}>
								{d.name}
								{d.publishedAt ? (
									<Badge
										pill
										style={{ fontSize: "18px" }}
										className="align-self-center"
										bg="success">
										Public
									</Badge>
								) : (
									<Badge
										pill
										style={{ fontSize: "15px" }}
										className="align-self-center"
										bg="danger">
										Not Public
									</Badge>
								)}
							</Card.Header>
							<Card.Body className="border border-info">
								<Card.Text>{d.description}</Card.Text>
							</Card.Body>
						</Card>
					))}
					<Createmodal show={show} handleClose={handleClose} handleShow={handleShow} />
				</Stack>
			)}
		</>
	);
}
export default Staffpage;
