import Stack from "react-bootstrap/Stack";
import axios from "axios";
import { useState, useEffect, Fragment } from "react";
import Card from "react-bootstrap/Card";
import { Form, Button } from "react-bootstrap";
import axiosConfig from "./axios-intercepter";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Badge from "react-bootstrap/Badge";
function Evendetail() {
	const [listevent, setlistevent] = useState([]);
	const [score, setscore] = useState({});
	const [seen, setseen] = useState(null);
	const [note, setnote] = useState(null);

	const [loadind, setloading] = useState(false);
	const [key, setkey] = useState(null);
	const param = useParams();
	const checkseen = async (s) => {
		try {
			if (s == null) {
				await axios.put(
					`http://localhost:1337/api/events/${param.slug}/seen`
				);
				fetchItems();
			}
		} catch (error) {
			console.log(error);
		}
	};
	const checknote = async () => {
		try {
			await axios.put(
				`http://localhost:1337/api/events/${param.slug}/noted`
			);
			fetchItems();
		} catch (error) {
			console.log(error);
		}
	};

	const fetchItems = async () => {
		try {
			const ac = axiosConfig;
			console.log("fetch");
			const response = await axios.get(
				`http://localhost:1337/api/events/findonebystd/${param.slug}`
			);
			const event = response.data.data;
			const score = event.scores[0];
			setscore({ ...score });
			setnote(score.noted);
			setseen(score.seen);
			if (score.JSONdata) {
				const k = Object.values(score.JSONdata);
				setkey(k);
			}
			setlistevent({ ...event });
			return score;
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		const fetchdata = async () => {
			setloading(true);
			const res = await fetchItems();
			if (res) {
				const time = setTimeout(() => {
					checkseen(res.seen);
				}, 5000);
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
			) : (
				<Card
					border="info"
					bg="dark"
					className="mt-3 w-75 mx-auto text-white "
					key={listevent.id}
					slug={listevent.slug}
				>
					<Card.Header className="d-flex justify-content-between">
						<Card.Text
							style={{ fontSize: "30px" }}
							className="mb-0 "
						>
							{listevent.name}
						</Card.Text>
						<div className="d-flex align-self-center">
							<Card.Text
								style={{ fontSize: "20px" }}
								className="mb-0"
							>
								seen :{" "}
							</Card.Text>
							{seen ? (
								<Badge
									className="align-self-center"
									pill
									bg="success"
								>
									check
								</Badge>
							) : (
								<Spinner
									className="mt-0"
									animation="grow"
									variant="light"
								/>
							)}
							<Card.Text
								style={{ fontSize: "20px" }}
								className="mb-0"
							>
								noted :{" "}
							</Card.Text>
							{note ? (
								<Badge
									className="align-self-center"
									pill
									bg="success"
								>
									check
								</Badge>
							) : (
								<Button onClick={checknote}>check</Button>
							)}
						</div>
					</Card.Header>
					<Card.Body className="d-flex border border-info ">
						<Card.Text className="flex-fill w-50">
							รายละเอียด :
							<br />
							{listevent.description}
						</Card.Text>
						<Card
							border="danger"
							bg="dark"
							className="flex-fill w-50 text-white"
							key={listevent.id}
							slug={listevent.slug}
						>
							<Card.Header>
								{key ? score.label : "no announcement"}
							</Card.Header>
							<Card.Body className="border border-danger">
								{console.log(key)}
								{key ? (
									<Table
										className="table-info"
										striped
										hover
										bordered
										size="sm"
									>
										<thead>
											<tr>
												<th>ชื่อ</th>
												<th>คะแนน</th>
												<th>ผลการประเมิน</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												{key.map((o, i) => {
													return <td key={i}>{o}</td>;
												})}
											</tr>
										</tbody>
									</Table>
								) : (
									<Card.Text>
										ask staff for more information...
									</Card.Text>
								)}
							</Card.Body>
						</Card>
					</Card.Body>
				</Card>
			)}
		</>
	);
}
export default Evendetail;
