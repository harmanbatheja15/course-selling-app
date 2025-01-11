import { useState, useEffect } from 'react';
import { FaEnvelope, FaUser } from 'react-icons/fa';
import { GoOrganization } from 'react-icons/go';
import { useQuery } from '@tanstack/react-query';
import { getInstructorProfile } from '../../api/profile';
import { Error, Loading } from '../../components/LoadingError';

const Profile = () => {
	const { isLoading, error, data } = useQuery({
		queryKey: ['instructorProfile'],
		queryFn: getInstructorProfile,
	});

	const [name, setName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [organization, setOrganization] = useState<string>('');

	useEffect(() => {
		if (data) {
			setName(data.name);
			setEmail(data.email);
			setOrganization(data.organization);
		}
	}, [data]);

	if (isLoading) {
		return <Loading />;
	}

	if (error) {
		return <Error />;
	}

	return (
		<>
			<div className='flex flex-col sm:px-6 lg:px-8'>
				<div className='sm:mx-auto sm:w-full sm:max-w-md'>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						Profile
					</h2>
				</div>

				<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
					<div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
						<form className='space-y-6'>
							<div>
								<label
									htmlFor='fullName'
									className='block text-sm font-medium text-gray-700'
								>
									Full Name
								</label>
								<div className='mt-1 relative rounded-md shadow-sm'>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
										<FaUser className='h-5 w-5 text-gray-400' />
									</div>
									<input
										type='text'
										name='fullName'
										id='fullName'
										value={name}
										onChange={(e) =>
											setName(e.target.value)
										}
										className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
										placeholder='John Doe'
										required
										readOnly
									/>
								</div>
							</div>

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
										onChange={(e) =>
											setEmail(e.target.value)
										}
										className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
										placeholder='you@example.com'
										required
										readOnly
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor='organization'
									className='block text-sm font-medium text-gray-700'
								>
									Organization
								</label>
								<div className='mt-1 relative rounded-md shadow-sm'>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
										<GoOrganization className='h-5 w-5 text-gray-400' />
									</div>
									<input
										type='text'
										name='organization'
										id='organization'
										value={organization}
										onChange={(e) =>
											setOrganization(e.target.value)
										}
										className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
										placeholder=''
										required
										readOnly
									/>
								</div>
							</div>

							{/* <div>
								<button
									type='submit'
									className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50'
								>
									Submit
								</button>
							</div> */}
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default Profile;
