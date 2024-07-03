import ReactGA from 'react-ga4';
import './App.css';
import { Wrapper } from './GlobalStyles';
import Header from './components/Header';
import Transcription from './components/Transcription';
import { useEffect } from 'react';
import { tracking_id } from './API';
import {
	HashRouter as Router,
	Route,
	Routes,
	useLocation,
} from 'react-router-dom';
import View from './components/View';
import Files from './components/Files';
import SignUpForm from './components/Auth/SignUp';
import SignInForm from './components/Auth/SignIn';
import ResetPasswordForm from './components/Auth/ForgotPassword/ResetPassword';
import CheckInbox from './components/Auth/ForgotPassword/checkInbox';
import ForgotPasswordForm from './components/Auth/ForgotPassword/ForgotPassword';
import ResetPasswordSuccess from './components/Auth/ForgotPassword/ResetPasswordSuccess';
import ChangePasswordForm from './components/Auth/ForgotPassword/ChangePassword';

function AppComponent() {
	useEffect(() => {
		ReactGA.initialize(tracking_id);
		ReactGA.send('pageview');
	}, []);

	const location = useLocation();

	const isAuthPage =
		location.pathname === '/login' ||
		location.pathname === '/register' ||
		location.pathname === '/forgot-password' ||
		location.pathname === '/check-inbox' ||
		location.pathname === '/reset-password' ||
		location.pathname === '/reset-password-success';

	return (
		<>
			<div className='h-screen'>
				{!isAuthPage && <Header />}
				<Routes>
					<Route
						path='/'
						element={
							<Wrapper>
								<Transcription />
							</Wrapper>
						}
					/>
					<Route
						path='/files'
						element={
							<Wrapper>
								<Files />
							</Wrapper>
						}
					/>
					<Route
						path='/files/edit/:id'
						element={
							<Wrapper>
								<View />
							</Wrapper>
						}
					/>
					<Route path='/register' element={<SignUpForm />} />
					<Route path='/login' element={<SignInForm />} />
					<Route path='/forgot-password' element={<ForgotPasswordForm />} />
					<Route path='/check-inbox' element={<CheckInbox />} />
					<Route
						path='/reset-password-success'
						element={<ResetPasswordSuccess />}
					/>
					<Route path='/reset-password' element={<ResetPasswordForm />} />
					<Route path='/change-password' element={<ChangePasswordForm />} />
				</Routes>
			</div>
		</>
	);
}

function App() {
	return (
		<Router>
			<AppComponent />
		</Router>
	);
}

export default App;
