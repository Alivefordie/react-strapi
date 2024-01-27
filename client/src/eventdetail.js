import axios from "axios";
import axiosConfig from "./axios-intercepter";
import { Button, Card, Spinner, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Scorecard from "./components/scorecard";
function Evendetail() {
	const [listevent, setlistevent] = useState([]);
	const [score, setscore] = useState({});
	const [seen, setseen] = useState(null);
	const [note, setnote] = useState(null);
	const [geterror, seterror] = useState({});
	const [loadind, setloading] = useState(false);
	const param = useParams();
	const er = (
		<>
			<h1>status : {geterror?.status}</h1>
			<h1>name :{geterror?.name}</h1>
			<h1>message : {geterror?.message}</h1>
		</>
	);
	const checkseen = async (s) => {
		try {
			if (s == null) {
				await axios.put(`http://localhost:1337/api/events/${param.slug}/seen`);
				fetchItems();
			}
		} catch (error) {
			console.log(error);
		}
	};
	const checknote = async () => {
		try {
			await axios.put(`http://localhost:1337/api/events/${param.slug}/noted`);
			fetchItems();
		} catch (error) {
			console.log(error);
		}
	};
	const fetchItems = async () => {
		try {
			const ac = axiosConfig;
			const response = await axios.get(
				`http://localhost:1337/api/events/findonebystd/${param.slug}`
			);
			seterror(null);
			const event = response.data.data;
			const score = event.scores[0];
			setscore({ ...score });
			setnote(score.noted);
			setseen(score.seen);
			setlistevent({ ...event });
			return score;
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
					style={{ width: "10rem", height: "10rem", borderWidth: "1rem" }}
					size="lg"
					animation="border"
					variant="light"
				/>
			) : geterror ? (
				er
			) : (
				<Card border="info" bg="dark" className="mt-3 w-75 mx-auto text-white ">
					<Card.Header className="d-flex justify-content-between">
						<Card.Text style={{ fontSize: "30px" }} className="mb-0 ">
							{listevent.name}
						</Card.Text>
						<div className="d-flex align-self-center">
							<Card.Text style={{ fontSize: "20px" }} className="mb-0">
								seen :{" "}
							</Card.Text>
							{seen ? (
								<Badge className="align-self-center" pill bg="success">
									check
								</Badge>
							) : (
								<Spinner className="mt-0" animation="grow" variant="light" />
							)}
							<Card.Text style={{ fontSize: "20px" }} className="mb-0">
								noted :{" "}
							</Card.Text>
							{note ? (
								<Badge className="align-self-center" pill bg="success">
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
						<Scorecard score={score} />
					</Card.Body>
				</Card>
			)}
		</>
	);
}
export default Evendetail;
