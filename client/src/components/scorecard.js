import { Card } from "react-bootstrap";
import Scoretable from "./scoretable";
function Scorecard({ score }) {
	const jsonscore = score.JSONdata;
	const value = Object.values(jsonscore);
	const key = Object.keys(jsonscore);
	return (
		<Card border="danger" bg="dark" className="flex-fill w-50 text-white">
			<Card.Header>{key ? score.label : "no announcement"}</Card.Header>
			<Card.Body className="border border-danger">
				{key ? (
					<Scoretable keydata={key} value={value} />
				) : (
					<Card.Text>ask staff for more information...</Card.Text>
				)}
			</Card.Body>
		</Card>
	);
}
export default Scorecard;
