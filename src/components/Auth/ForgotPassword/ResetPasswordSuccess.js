import React from 'react';
import AuthCard from '../AuthWrapper';
import { useNavigate } from 'react-router-dom';

const ResetPasswordSuccess = () => {
	const navigate = useNavigate();

	const handleBackToLogin = () => {
		navigate('/login');
	};

	return (
		<AuthCard
			headerLabel='Successful!'
			messageLabel='Congratulations! Your password has been reset successfully.'
		>
			<div className='w-full flex flex-col items-center'>
				<button
					onClick={handleBackToLogin}
					className='w-full h-12 outline-none flex items-center justify-center rounded-md text-base font-semibold mb-7 border-2 border-transparent bg-sunbird-orange text-white hover:bg-opacity-90 transition-all ease-out duration-[0.3s]'
				>
					Back to Login
				</button>
			</div>
		</AuthCard>
	);
};

export default ResetPasswordSuccess;
