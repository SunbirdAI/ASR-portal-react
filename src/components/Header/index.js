import { Nav, Title, Logo } from "./Header.styles";
import { Dropdown } from "../DropDown";
import img from "../../images/logo.png";

const Header = () => (
  <Nav>
    <Logo alt="Logo" src={img} />
    <Title>Speech To Text.</Title>
    <Dropdown />
  </Nav>
);

export default Header;
