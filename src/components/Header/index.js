import {Nav, Title, Logo, DropdownMenu, LoginButton} from "./Header.styles";
import img from '../../images/logo.png';
import { NavLink, useLocation } from "react-router-dom";



function handleClick() {
    console.log('I have been touched... how dare you')
}

const Header = () => (
    <Nav >
        <Logo alt="Logo" src={img}/>
        <Title>
            Speech To Text.
        </Title>
        {localStorage.getItem("access_token") ?
        <DropdownMenu /> :
        <LoginButton onClick={(handleClick)}>
            <NavLink className={"whitespace-nowrap"} to={'/login'} >
                Sign In
            </NavLink>
        </LoginButton>}
        
        {/* <DropdownMenu/> */}
    </Nav>
);

export default Header;
