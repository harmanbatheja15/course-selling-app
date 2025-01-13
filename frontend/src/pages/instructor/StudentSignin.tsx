import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEyeSlash, FaEye } from 'react-icons/fa';
import { API_URL } from '../../config';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { tokenState } from '../../atoms';

const StudentSignin = () => {
	const navigate = useNavigate();
	const [token, setToken] = useRecoilState(tokenState);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setIsSubmitting(true);

			const response = await axios.post(`${API_URL}/student/signin`, {
				email,
				password,
			});

			setIsSubmitting(false);
			setEmail('');
			setPassword('');
			localStorage.setItem('token', response.data.token);
			setToken(response.data.token);
			alert('Signed in successfully.');
			navigate(`/`);
		} catch (error) {
			console.error(error);
			setIsSubmitting(false);
		}
	};

	return (
		<div className='flex flex-col mt-10 sm:px-6 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<h2 className='text-center text-3xl font-extrabold text-gray-900'>
					Sign In
				</h2>
			</div>

			<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
				<div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					<form className='space-y-6' onSubmit={handleSubmit}>
						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-gray-700'
							>
								Email address
							</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<FaEnvelope className='h-5 w-5 text-gray-400' />
								</div>
								<input
									type='email'
									name='email'
									id='email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
									placeholder='you@example.com'
									required
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor='password'
								className='block text-sm font-medium text-gray-700'
							>
								Password
							</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<FaLock className='h-5 w-5 text-gray-400' />
								</div>
								<input
									type={showPassword ? 'text' : 'password'}
									name='password'
									id='password'
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									className={`block w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
									required
								/>
								<div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
									<button
										type='button'
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className='text-gray-400 hover:text-gray-500 focus:outline-none'
									>
										{showPassword ? (
											<FaEyeSlash className='h-5 w-5' />
										) : (
											<FaEye className='h-5 w-5' />
										)}
									</button>
								</div>
							</div>
						</div>

						<div>
							<button
								type='submit'
								disabled={isSubmitting}
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50'
							>
								{isSubmitting ? 'Signing in...' : 'Sign In'}
							</button>
						</div>
					</form>

					<div className='mt-6'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-300' />
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-2 bg-white text-gray-500'>
									Don't have an account?
								</span>
							</div>
						</div>

						<div className='mt-6'>
							<Link to='/signup'>
								<button className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
									Sign Up
								</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StudentSignin;
