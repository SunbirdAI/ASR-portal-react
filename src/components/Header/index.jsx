import React from "react"
import { Nav, Title, Logo, Brand } from "./Header.styles";
import { Dropdown } from "../DropDown";
import img from "../../images/logo1.png";

const Header = () => (
  <Nav>
    <Brand>
      <Logo alt="Logo" src={img} />
      <Title>Sunbird AI</Title>
    </Brand>
    <Dropdown />
  </Nav>
);

export default Header;
