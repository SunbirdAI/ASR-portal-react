import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
import { changePassword } from '../../../API';

const ChangePasswordSchema = z.object({
	oldPassword: z.string(),
	newPassword: z
		.string()
		.min(1, 'Password is required')
		.min(10, 'Password must have at least 10 characters')
		.regex(/[A-Z]/, 'Password must contain at least one capital letter')
		.regex(/[0-9]/, 'Password must contain at least one number')
		.regex(
			/[!@#$%^&*(),.?":{}|<>]/,
			'Password must contain at least one symbol'
		),
});

const ChangePasswordForm = () => {
	const navigate = useNavigate();
	const [pending, setPending] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const form = useForm({
		resolver: zodResolver(ChangePasswordSchema),
		defaultValues: {
			oldPassword: '',
			newPassword: '',
		},
	});

	const onSubmit = async (values) => {
		setError('');
		setSuccess('');
		setPending(true);

		await changePassword(values)
			.then((data) => {
				if (data?.success) {
					setSuccess(data?.success);
					navigate('/');
				}

				if (data?.error) {
					setError(data?.error);
				}
			})
			.finally(() => {
				setPending(false);
				form.reset();
			});
	};

	return (
		<AuthCard
			headerLabel='Change Password'
			messageLabel='Enter your old and new password'
			backref='/'
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FormSuccess message={success} />
					<FormError message={error} />

					<FormField
						control={form.control}
						name='oldPassword'
						render={({ field }) => (
							<FormItem className='w-full h-auto mb-5'>
								<FormLabel className='mb-1'>Old Password</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter old password'
										type='password'
										{...field}
										disabled={pending}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='newPassword'
						render={({ field }) => (
							<FormItem className='w-full h-auto mb-5'>
								<FormLabel className='mb-1'>New Password</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter New Password'
										type='password'
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
							'Confirm Password'
						)}
					</button>
				</form>
			</Form>
		</AuthCard>
	);
};

export default ChangePasswordForm;