import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../UI/Form';
import { Input } from '../../UI/Input';
import { FormError, FormSuccess } from '../AuthFormMessage';
import AuthCard from '../AuthWrapper';
import { Loader2 } from 'lucide-react';
import { forgotPassword } from '../../../API';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
});

const ForgotPasswordForm = () => {
	const navigate = useNavigate();
	const [pending, setPending] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const form = useForm({
		resolver: zodResolver(ForgotPasswordSchema),
		defaultValues: {
			email: '',
		},
	});

	const onSubmit = async (values) => {
		setError('');
		setSuccess('');
		setPending(true);

		const response = await forgotPassword(values)
			.then((data) => {
				console.log('token data', data);
				if (data?.success) {
					console.log('success');
					setSuccess(data?.success);
					navigate('/check-inbox');
				}

				if (data?.error) {
					console.log('error');
					setError(data?.error);
				}
			})
			.finally(() => {
				setPending(false);
				form.reset();
			});

		console.log(response);
	};

	return (
		<AuthCard
			headerLabel='Forgot Password'
			messageLabel='Enter your email to reset your password.'
			backref='/login'
			backrefDescription='Remembered your password?'
			backrefMessage='Sign In'
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FormSuccess message={success} />
					<FormError message={error} />

					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem className='w-full h-auto mb-5'>
								<FormLabel className='mb-1'>Email</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter your email'
										{...field}
										disabled={pending}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<button
						className='w-full h-12 outline-none flex items-center justify-center rounded-md text-base font-semibold mb-7 border-2 border-transparent bg-sunbird-orange text-white hover:bg-opacity-90 transition-all ease-out duration-[0.3s]'
						disabled={pending}
					>
						{pending ? (
							<Loader2 className='animate-spin' />
						) : (
							'Send me Instructions'
						)}
					</button>
				</form>
			</Form>
		</AuthCard>
	);
};

export default ForgotPasswordForm;
