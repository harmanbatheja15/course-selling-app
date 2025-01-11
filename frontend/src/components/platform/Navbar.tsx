import { useState } from 'react';
// import ClickAwayListener from 'react-click-away-listener';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu, CircleUserRound } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
// import { useRecoilValue } from 'recoil';
// import { instructorState } from '../../atoms';

const Navbar = () => {
	const navigate = useNavigate();
	const { isAuthenticated, logout } = useAuth();
	// const instructor = useRecoilValue(instructorState);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const handleLogout = async () => {
		try {
			await logout();
			setIsMobileMenuOpen(false);
			navigate('/instructor/signin');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	const MobileMenu = () => {
		return (
			<div className='absolute top-[90px] left-0 bg-white w-full z-50 shadow-lg rounded-xl p-4 space-y-4'>
				{!isAuthenticated ? (
					<>
						<div className=''>
							<Link
								to='/'
								className='font-medium'
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Features
							</Link>
						</div>
						<div className=''>
							<Link
								to='/'
								className='text-[#ed7e07] font-medium'
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Success Stories
							</Link>
						</div>
						<div className='flex items-center justify-start'>
							<Link
								to='/instructor/signup'
								className='flex items-center justify-start text-white font-semibold bg-[#ef5332] hover:bg-[black] rounded-full py-3 px-6 transition-all duration-300 ease-in-out'
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Signup as Educator
								<div className='pl-2'>
									<ChevronRight color='white' size={20} />
								</div>
							</Link>
						</div>
					</>
				) : (
					<>
						<div className='relative'>
							<Link
								to='/instructor/profile'
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

	// const Dropdown = () => {
	// 	return (
	// 		<>
	// 			<div className='w-[200px] absolute top-12 sm:left-0 right-0 bg-white border rounded-xl z-50'>
	// 				<div
	// 					className=''
	// 					onClick={() => setIsDropdownOpen(!isDropdownOpen)}
	// 				>
	// 					<Link to='/'>
	// 						<div className='cursor-pointer border-b p-3'>
	// 							Profile
	// 						</div>
	// 					</Link>
	// 					<Link to='/dashboard'>
	// 						<div className='cursor-pointer p-3'>Dashboard</div>
	// 					</Link>
	// 				</div>
	// 			</div>
	// 		</>
	// 	);
	// };

	return (
		<>
			<nav className='lg:px-8 px-4 pt-4'>
				<div
					className={`relative flex items-center justify-between rounded-2xl px-8 py-3 ${
						isAuthenticated
							? 'border-none'
							: 'border border-dashed border-[#ed7e07]'
					}`}
				>
					<div className=''>
						<Link
							to={isAuthenticated ? '/instructor/dashboard' : '/'}
						>
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
									<div>
										<Link
											to='#'
											className='flex items-center justify-center font-medium'
										>
											<div>Features</div>
											<div className='pt-1 pl-2'>
												<ChevronDown size={16} />
											</div>
										</Link>
									</div>
									<div>
										<Link
											to='#'
											className='text-[#ed7e07] font-medium'
										>
											Success Stories
										</Link>
									</div>
									<div className='flex items-center justify-center'>
										<Link
											to='/instructor/signup'
											className='flex items-center justify-start text-white font-semibold bg-[#ef5332] hover:bg-[black] rounded-full py-3 px-6 transition-all duration-300 ease-in-out'
										>
											Signup as Educator
											<div className='pl-2'>
												<ChevronRight
													color='white'
													size={20}
												/>
											</div>
										</Link>
									</div>
								</>
							) : (
								<>
									<div className='relative'>
										<Link
											to='/instructor/profile'
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

export default Navbar;
