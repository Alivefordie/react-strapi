import Stack from "react-bootstrap/Stack";
import axios from "axios";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { Form, Button } from "react-bootstrap";
import axiosConfig from "./axios-intercepter";
import { json, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { Row, Col } from "react-bootstrap";
import * as xlsx from "xlsx";
import Spinner from "react-bootstrap/Spinner";
function Staffpage() {
	const [listevent, setlistevent] = useState([]);
	const [show, setShow] = useState(false);
	const [data, setdata] = useState({});
	const [jff, setjff] = useState(null);
	const [puredata, setpuredata] = useState([]);
	const [validated, setValidated] = useState(false);
	const [search, setsearch] = useState("");
	const navigate = useNavigate();
	const [geterror, seterror] = useState({});
	const [loadind, setloading] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const readUploadFile = (e) => {
		e.preventDefault();
		if (e.target.files) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const data = e.target.result;
				const workbook = xlsx.read(data, { type: "array" });
				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[sheetName];
				const json = xlsx.utils.sheet_to_json(worksheet);
				setjff(JSON.stringify(json));
			};
			reader.readAsArrayBuffer(e.target.files[0]);
		}
	};
	const handleSearch = (e) => {
		e.preventDefault();
		if (search) {
			fetchItems();
		}
	};
	useEffect(() => {
		setlistevent(
			puredata.map((d) => (
				<Card
					border="info"
					bg="dark"
					className="w-75 mx-auto text-white"
					key={d.id}
					slug={d.slug}
					onClick={() => navigate(`/staff/${d.slug}`)}
					style={{ cursor: "pointer" }}>
					<Card.Header style={{ fontSize: "30px" }}>{d.name}</Card.Header>
					<Card.Body className="border border-info">
						<Card.Text>{d.description}</Card.Text>
					</Card.Body>
				</Card>
			))
		);
	}, [puredata]);

	useEffect(() => {
		if (jff) {
			setdata({ ...data, exfile: JSON.parse(jff) });
		}
	}, [jff]);

	const handleChange = (e) => {
		const key = e.target.name;
		const form = e.target;
		if (form.checkValidity() === false) {
			e.preventDefault();
			e.stopPropagation();
		}
		const value = e.target.value;
		setdata({ ...data, [key]: value });
	};
	const handleSubmit = async (event) => {
		if (Object.keys(data).length == 5) {
			const t = Date.parse(data.date + "T" + data.time);
			const t2 = new Date(t);

			try {
				const alluser = await axios.get(
					"http://localhost:1337/api/users?populate[0]=role&filters[role][name][$eq]=student"
				);
				const all = data.exfile.map((as) => {
					const key = Object.keys(as);
					const idu = alluser.data.filter((u) => {
						if (u.usrId == as[key[0]]) {
							return u;
						} else {
							return null;
						}
					});
					return {
						["label"]: String(as[key[0]]),
						["JSONdata"]: as,
						["student"]: idu[0] ? idu[0].id : null,
					};
				});
				const ok = await axios.post("http://localhost:1337/api/events", {
					data: {
						name: data.Name,
						description: data.Descpition,
						datedeploy: t2.toISOString(),
						// not public
						// publishedAt: null,
						// publishedAt: t2.toISOString(), if real deploy
						scores: all,
					},
				});
				navigate(`/staff/${ok.data.data.slug}`);
			} catch (err) {
				console.log(err);
			}
		} else {
			setValidated(true);
		}
	};
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
				<>
					<h1>status : {geterror.status}</h1>
					<h1>name :{geterror.name}</h1>
					<h1>message : {geterror.message}</h1>
				</>
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
					{listevent}
					<Modal
						className="bg-black bg-opacity-75"
						size="lg"
						centered
						show={show}
						onHide={handleClose}>
						<Modal.Header
							style={{
								background: "rgb(164, 17, 222)",
								color: "white",
								WebkitTextStrokeWidth: "0.5px",
								WebkitTextStrokeColor: "black",
							}}
							closeButton>
							<Modal.Title>Create</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form noValidate validated={validated}>
								<Form.Group as={Row} className="mb-3">
									<Form.Label column sm="2">
										Name
									</Form.Label>
									<Col sm="10">
										<Form.Control
											name={"Name"}
											onChange={handleChange}
											type="text"
											placeholder="*Exam999"
											required
										/>
									</Col>
								</Form.Group>
								<Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlTextarea1">
									<Form.Label column sm="2">
										Descpition
									</Form.Label>
									<Col sm="10">
										<Form.Control
											name={"Descpition"}
											onChange={handleChange}
											as="textarea"
											required
										/>
									</Col>
								</Form.Group>
								<Form.Group as={Row} className="mb-3" controlId="formFile">
									<Form.Label column sm="2">
										Excel file
									</Form.Label>
									<Col sm="10">
										<Form.Control name={"Exfile"} onChange={readUploadFile} type="file" required />
									</Col>
								</Form.Group>
								<Form.Group as={Row} className="mb-3">
									<Form.Label column sm="2">
										Announcement
									</Form.Label>
									<Col sm="5">
										<Form.Control name={"time"} onChange={handleChange} type="time" required />
									</Col>
									<Col sm="5">
										<Form.Control name={"date"} onChange={handleChange} type="date" required />
									</Col>
								</Form.Group>
							</Form>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleClose}>
								Close
							</Button>
							<Button onClick={handleSubmit} variant="primary">
								Confirm
							</Button>
						</Modal.Footer>
					</Modal>
				</Stack>
			)}
		</>
	);
}
export default Staffpage;
