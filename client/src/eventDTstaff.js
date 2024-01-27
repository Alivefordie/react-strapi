import axios from "axios";
import axiosConfig from "./axios-intercepter";
import { Form, Button, Badge, Accordion, Card, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
import "./eventdettstaff.css";
import Scoretable from "./components/scoretable";
function Evendtstaff() {
	const [listevent, setlistevent] = useState([]);
	const [loadind, setloading] = useState(false);
	const [edit, setedit] = useState(false);
	const [geterror, seterror] = useState({});
	const [key, setkey] = useState(null);
	const [value, setvalue] = useState(null);
	const navigate = useNavigate();
	const param = useParams();
	const er = (
		<>
			<h1>status : {geterror?.status}</h1>
			<h1>name :{geterror?.name}</h1>
			<h1>message : {geterror?.message}</h1>
		</>
	);
	const cancel = () => setedit(!edit);
	const editname = async () => {
		if (edit) {
			const newres = await axios.put(`http://localhost:1337/api/events/${param.slug}`, {
				data: {
					name: listevent.name,
				},
			});
			navigate(`/staff/${newres.data.data.slug}`);
		}
		setedit(!edit);
	};
	const fetchItems = async () => {
		try {
			const response = await axios.get(`http://localhost:1337/api/events/${param.slug}`);
			const event = response.data.data;
			seterror(null);
			setlistevent({ ...event });
			const keys = event.scores.map((s) => Object.keys(s.JSONdata));
			const values = event.scores.map((s) => Object.values(s.JSONdata));
			setkey(keys);
			setvalue(values);
			return event;
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
		const fetchdata = async () => {
			setloading(true);
			const ac = axiosConfig;
			const res = await fetchItems();
			if (res) {
				setloading(false);
			}
		};
		fetchdata();
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
				<Card
					border="info"
					bg="dark"
					className="mt-3 w-75 mx-auto text-white "
					key={listevent.id}
					slug={listevent.slug}>
					<Card.Header className=" d-flex justify-content-between">
						{edit ? (
							<Form>
								<Form.Control
									type="text"
									value={listevent.name}
									required
									onChange={(e) => {
										setlistevent({ ...listevent, ["name"]: e.target.value });
									}}
								/>
							</Form>
						) : (
							<Card.Text style={{ fontSize: "30px" }} className="mb-0 ">
								{listevent.name}
							</Card.Text>
						)}
						<div className="d-flex align-self-center">
							{edit ? (
								<>
									<Button variant="secondary" onClick={cancel}>
										Cancel
									</Button>
									<Button className="ms-2" variant="success" onClick={editname}>
										Confirm
									</Button>
								</>
							) : (
								<Button onClick={editname}>Edit</Button>
							)}
						</div>
					</Card.Header>
					<Card.Body className=" border border-info ">
						<div className="d-flex justify-content-between">
							<Card.Text className="flex-fill pe-3 w-50">
								รายละเอียด :
								<br />
								{listevent.description}
							</Card.Text>
							<Card.Text className="w-25">
								สถานะ :{"   "}
								{listevent.publishedAt ? (
									<Badge pill bg="success">
										Public
									</Badge>
								) : (
									<Badge pill bg="danger">
										Not Public
									</Badge>
								)}
								<br />
								วันและเวลาที่ประกาศ :
								<br />
								{new Date(listevent.publishedAt).toLocaleString()}
							</Card.Text>
						</div>
						<Accordion className="mt-3" alwaysOpen data-bs-theme="dark">
							{listevent.scores.map((s, i) => (
								<Accordion.Item eventKey={i} key={i}>
									<Accordion.Header className="d-flex justify-content-between">
										<div className="d-flex me-auto ">{s.label}</div>
										{s.seen ? (
											<Badge className="d-flex me-2 align-self-center" pill bg="success">
												seen
											</Badge>
										) : (
											<Badge className="d-flex ms-auto me-2 " pill bg="danger">
												unseen
											</Badge>
										)}
										{s.noted ? (
											<Badge className="d-flex ms-2 me-2 align-self-center" pill bg="success">
												noted
											</Badge>
										) : (
											<Badge className="d-flex ms-2 me-2 align-self-center" pill bg="danger">
												unnoted
											</Badge>
										)}
									</Accordion.Header>
									<Accordion.Body>
										<Scoretable keydata={key[i]} value={value[i]} />
									</Accordion.Body>
								</Accordion.Item>
							))}
						</Accordion>
					</Card.Body>
				</Card>
			)}
		</>
	);
}
export default Evendtstaff;
