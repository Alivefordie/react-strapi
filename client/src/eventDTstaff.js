import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, Fragment } from "react";
import Card from "react-bootstrap/Card";
import { Form, Button } from "react-bootstrap";
import axiosConfig from "./axios-intercepter";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
function Evendtstaff() {
	const [listevent, setlistevent] = useState([]);
	const [loadind, setloading] = useState(false);
	const [edit, setedit] = useState(false);
	const [geterror, seterror] = useState({});
	const navigate = useNavigate();
	const param = useParams();

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
			return event;
		} catch (err) {
			console.log(err.response.data.error);
			seterror(err.response.data.error);
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
							<Button onClick={editname}>Edit</Button>
						</div>
					</Card.Header>
					<Card.Body className="border border-info ">
						<Card.Text className="w-100">
							รายละเอียด :
							<br />
							{listevent.description}
						</Card.Text>
						<Card
							border="danger"
							bg="dark"
							className="w-100 text-white"
							key={listevent.id}
							slug={listevent.slug}
						>
							<Card.Header>score</Card.Header>
							<Card.Body className="border border-danger">
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
											<td>
												Markเฟเเเเเเเเเเเเเเเเเเเเเเเเเเ
											</td>
											<td>Otto</td>
											<td>@mdo</td>
										</tr>
										<tr>
											<td colSpan={2}>Larry the Bird</td>
											<td>@twitter</td>
										</tr>
									</tbody>
								</Table>
							</Card.Body>
						</Card>
					</Card.Body>
				</Card>
			)}
		</>
	);
}
export default Evendtstaff;
