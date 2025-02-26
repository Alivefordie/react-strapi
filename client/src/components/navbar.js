import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Outlet } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

function Navbarr() {
	const navigate = useNavigate();
	const info = JSON.parse(localStorage.getItem("userinfo"));
	return (
		<>
			<Navbar style={{ background: "#332941" }} className="text-white">
				<Container>
					<Navbar.Brand className="text-white">
						<Link
							to={`/${info.role.name}`}
							style={{
								color: "white",
								textDecoration: "none",
								fontSize: "25px",
							}}>
							Logo
						</Link>
					</Navbar.Brand>
					<Navbar.Toggle />
					<Navbar.Collapse className="justify-content-end">
						<NavDropdown
							style={{ fontSize: "20px" }}
							title={info.username}
							id="navbarScrollingDropdown">
							<NavDropdown.Item>{info.usrId}</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item
								onClick={() => {
									localStorage.removeItem("userinfo");
									localStorage.removeItem("jwttoken");
									delete axios.defaults.headers.common["Authorization"];
									navigate("/login");
								}}>
								logout
							</NavDropdown.Item>
						</NavDropdown>
					</Navbar.Collapse>
				</Container>
			</Navbar>
			<Outlet />
		</>
	);
}

export default Navbarr;
