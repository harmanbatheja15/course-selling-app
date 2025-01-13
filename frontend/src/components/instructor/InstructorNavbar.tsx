import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, CircleUserRound } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
// Use NavLink for Active Link

const InstructorNavbar = () => {
	const navigate = useNavigate();
	const { isAuthenticated, logout } = useAuth();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const handleLogout = async () => {
		try {
			await logout();
			setIsMobileMenuOpen(false);
			navigate('/signin');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	const MobileMenu = () => {
		return (
			<div className='absolute top-[60px] left-0 bg-white w-full z-50 shadow-lg rounded-xl p-4 space-y-4'>
				{!isAuthenticated ? (
					<>
						<div className='py-4'>
							<div className='mb-8'>
								<Link
									to='/signup'
									className='text-white font-semibold bg-[#156FE6] hover:bg-[black] rounded-full py-3 px-6 transition-all duration-300 ease-in-out'
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Signup
								</Link>
							</div>
							<div className=''>
								<Link
									to='/signin'
									className='text-white font-semibold bg-[#156FE6] hover:bg-[black] rounded-full py-3 px-6 transition-all duration-300 ease-in-out'
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Signin
								</Link>
							</div>
						</div>
					</>
				) : (
					<>
						<div className='relative'>
							<Link
								to='#'
								className='w-fit flex items-center justify-center font-medium border rounded-full px-4 py-2'
								onClick={() =>
									setIsDropdownOpen(!isDropdownOpen)
								}
							>
								<div className='pr-1'>
									<CircleUserRound />
								</div>
								<div>Profile</div>
								{/* <div className='pl-1'>
									<ChevronDown size={16} />
								</div> */}
							</Link>
						</div>
						<div className=''>
							<Link
								to='#'
								className='font-medium'
								onClick={handleLogout}
							>
								Logout
							</Link>
						</div>
					</>
				)}
			</div>
		);
	};

	return (
		<>
			<nav className='lg:px-8 px-4'>
				<div
					className={`relative flex items-center justify-between rounded-2xl px-8 py-3`}
				>
					<div className=''>
						<Link to='/'>
							<img
								src='https://cdn-icons-png.flaticon.com/512/8238/8238761.png'
								alt=''
								className='max-w-[3rem]'
							/>
						</Link>
					</div>
					<div>
						<div className='hidden lg:flex items-center justify-center space-x-6'>
							{!isAuthenticated ? (
								<>
									<div className='flex items-center justify-center'>
										<Link
											to='/signup'
											className='text-white font-semibold bg-[#156FE6] hover:bg-[black] rounded-full py-3 px-6 transition-all duration-300 ease-in-out'
										>
											Signup
										</Link>
									</div>
									<div className='flex items-center justify-center'>
										<Link
											to='/signin'
											className='text-white font-semibold bg-[#156FE6] hover:bg-[black] rounded-full py-3 px-6 transition-all duration-300 ease-in-out'
										>
											Signin
										</Link>
									</div>
								</>
							) : (
								<>
									<div className='relative'>
										<Link
											to='/enrolled-courses'
											className='font-medium'
										>
											<div>Enrolled Courses</div>
										</Link>
									</div>
									<div className='relative'>
										<Link
											to='#'
											className='flex items-center justify-center font-medium border rounded-full px-4 py-2'
											onClick={() =>
												setIsDropdownOpen(
													!isDropdownOpen
												)
											}
										>
											<div className='pr-1'>
												<CircleUserRound />
											</div>
											<div>Profile</div>
											{/* <div className='pl-1'>
												<ChevronDown size={16} />
											</div> */}
										</Link>
									</div>
									<div>
										<Link
											to='#'
											className='text-black font-medium'
											onClick={handleLogout}
										>
											Logout
										</Link>
									</div>
								</>
							)}
						</div>
						<div className='block lg:hidden'>
							<div
								className='cursor-pointer'
								onClick={() =>
									setIsMobileMenuOpen(!isMobileMenuOpen)
								}
							>
								<Menu />
							</div>
						</div>

						{isMobileMenuOpen && <MobileMenu />}
					</div>
				</div>
			</nav>
		</>
	);
};

export default InstructorNavbar;
