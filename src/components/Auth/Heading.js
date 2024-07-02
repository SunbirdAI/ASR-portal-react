import React from "react";
import { AuthHeading, AuthHeadingTitle, AuthHeadingSubTitle } from "./Auth.styles";
import { Logo } from '../Header/Header.styles';
import img from '../../images/logo1.png';

const Heading = ({ title, message }) => {
  return (
    <AuthHeading>
       <Logo src={img} alt="logo" className="mx-auto mb-2" ></Logo>
      <AuthHeadingTitle>{title}</AuthHeadingTitle>
        <AuthHeadingSubTitle>{message}</AuthHeadingSubTitle>
    </AuthHeading>
  );
};

export default Heading;
