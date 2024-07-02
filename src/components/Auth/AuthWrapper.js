import React from 'react';
import Heading from './Heading';
import {AuthContainer, AuthDiv, AuthFooter, AuthFooterDescription} from './Auth.styles';
import { NavLink } from 'react-router-dom';


const AuthCard = ({ children, headerLabel, messageLabel, backref, backrefDescription, backrefMessage }) => {
  return (
        
    <AuthContainer>
      <AuthDiv className='authcard'>
       
        <Heading title={headerLabel} message={messageLabel} />

        {children}

        <AuthFooter>
          <AuthFooterDescription>{backrefDescription}</AuthFooterDescription>
          <NavLink to={backref} className='text-sm font-medium hover:underline hover:text-sunbird-orange ease-out duration-[0.3s]'>
            {backrefMessage}
          </NavLink>
        </AuthFooter>
      </AuthDiv>
    </AuthContainer>
  )
}

export default AuthCard