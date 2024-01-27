import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { Row, Col } from "react-bootstrap";
import * as xlsx from "xlsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosConfig from "../axios-intercepter";
function Createmodal({ show, handleClose, handleShow }) {
	const [data, setdata] = useState({});
	const [jff, setjff] = useState(null);
	const [validated, setValidated] = useState(false);
	const navigate = useNavigate();
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
						publishedAt: null,
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
	useEffect(() => {
		const ac = axiosConfig;
	}, []);
	return (
		<Modal className="bg-black bg-opacity-75" size="lg" centered show={show} onHide={handleClose}>
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
							<Form.Control name={"Descpition"} onChange={handleChange} as="textarea" required />
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
	);
}
export default Createmodal;
