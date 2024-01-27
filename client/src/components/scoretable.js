import { useEffect } from "react";
import { Table } from "react-bootstrap";
import { useState } from "react";
function Scoretable({ keydata, value }) {
	const [theme, settheme] = useState("info");
	useEffect(() => {
		const rsc = value[1];
		if (!isNaN(rsc)) {
			if (rsc >= 75) {
				settheme("success");
			} else if (rsc >= 50) {
				settheme("secondary");
			} else {
				settheme("danger");
			}
		}
	}, []);
	return (
		<Table className={`table-${theme}`} striped hover bordered size="sm">
			<thead>
				<tr>
					{keydata.map((o, i) => (
						<th className={`bg-${theme}`} key={i}>
							{o}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				<tr>
					{value.map((o, i) => (
						<td key={i}>{o}</td>
					))}
				</tr>
			</tbody>
		</Table>
	);
}
export default Scoretable;
