import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, Fragment } from "react";
import Card from "react-bootstrap/Card";
import { Form, Button, Badge } from "react-bootstrap";
import axiosConfig from "./axios-intercepter";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import { Accordion } from "react-bootstrap";
import React from "react";
import "./eventdettstaff.css";
function Evendtstaff() {
	const [listevent, setlistevent] = useState([]);
	const [loadind, setloading] = useState(false);
	const [edit, setedit] = useState(false);
	const [geterror, seterror] = useState({});
	const [key, setkey] = useState([]);
	const navigate = useNavigate();
	const param = useParams();
	const cancel = () => setedit(!edit);
	const editname = async () => {
		if (edit) {
			const newres = await axios.put(
				`http://localhost:1337/api/events/${param.slug}`,
				{
					data: {
						name: listevent.name,
					},
				}
			);
			navigate(`/staff/${newres.data.data.slug}`);
		}
		setedit(!edit);
	};
	const fetchItems = async () => {
		try {
			console.log("fetch");
			const response = await axios.get(
				`http://localhost:1337/api/events/${param.slug}`
			);
			const event = response.data.data;
			console.log("%c%s", "color: #807160", response);
			seterror(null);
			setlistevent({ ...event });
			const scores = event.scores.map((s) => {
				return Object.keys(s.JSONdata);
			});
			setkey(scores);
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
				<>
					<h1>status : {geterror.status}</h1>
					<h1>name :{geterror.name}</h1>
					<h1>message : {geterror.message}</h1>
				</>
			) : (
				<Card
					border="info"
					bg="dark"
					className="mt-3 w-75 mx-auto text-white "
					key={listevent.id}
					slug={listevent.slug}
				>
					<Card.Header className="d-flex justify-content-between">
						{edit ? (
							<Form>
								<Form.Control
									type="text"
									value={listevent.name}
									required
									onChange={(e) => {
										setlistevent({
											...listevent,
											["name"]: e.target.value,
										});
									}}
								/>
							</Form>
						) : (
							<Card.Text
								style={{ fontSize: "30px" }}
								className="mb-0 "
							>
								{listevent.name}
							</Card.Text>
						)}
						<div className="d-flex align-self-center">
							{edit ? (
								<>
									<Button
										variant="secondary"
										onClick={cancel}
									>
										Cancel
									</Button>
									<Button
										className="ms-2"
										variant="success"
										onClick={editname}
									>
										Confirm
									</Button>
								</>
							) : (
								<Button onClick={editname}>Edit</Button>
							)}
						</div>
					</Card.Header>
					<Card.Body className="border border-info ">
						<div className="d-flex">
							<Card.Text className="flex-fill w-50">
								รายละเอียด :
								<br />
								{listevent.description}
							</Card.Text>
							<Card.Text className="flex-fill w-50">
								วันประกาศ :
								<br />
								{new Date(listevent.datedeploy).toString()}
							</Card.Text>
						</div>
						<Accordion flush data-bs-theme="dark">
							{listevent.scores.map((s, i) => {
								return (
									<Accordion.Item eventKey={i} key={i}>
										<Accordion.Header className="d-flex justify-content-between">
											<div className="d-flex me-auto ">
												{s.label}
											</div>
											{s.seen ? (
												<Badge
													className="d-flex me-2 align-self-center"
													pill
													bg="success"
												>
													seen
												</Badge>
											) : (
												<Badge
													className="d-flex ms-auto me-2 "
													pill
													bg="danger"
												>
													unseen
												</Badge>
											)}
											{s.noted ? (
												<Badge
													className="d-flex ms-2 me-2 align-self-center"
													pill
													bg="success"
												>
													noted
												</Badge>
											) : (
												<Badge
													className="d-flex ms-2 me-2 align-self-center"
													pill
													bg="danger"
												>
													unnoted
												</Badge>
											)}
										</Accordion.Header>
										<Accordion.Body>
											<Table
												className="table-info"
												striped
												hover
												bordered
												size="sm"
											>
												<thead>
													<tr>
														{key[i].map((o, oi) => {
															return (
																<th key={oi}>
																	{o}
																</th>
															);
														})}
													</tr>
												</thead>
												<tbody>
													<tr>
														{key[i].map((o, oi) => {
															return (
																<td key={oi}>
																	{
																		s
																			.JSONdata[
																			o
																		]
																	}
																</td>
															);
														})}
													</tr>
												</tbody>
											</Table>
										</Accordion.Body>
									</Accordion.Item>
								);
							})}
						</Accordion>
					</Card.Body>
				</Card>
			)}
		</>
	);
}
export default Evendtstaff;
