import { Link } from 'react-router-dom';

const Hero = () => {
	return (
		<>
			<div className='lg:px-8'>
				<div className='relative lg:h-[120vh] sm:h-[110vh] h-[100vh] flex flex-col items-center justify-start bg-[#ef5332] rounded-3xl pt-16 overflow-hidden'>
					<div className=''>
						<div className=''>
							<p className='text-white text-center font-medium text-[1.35rem]'>
								Trusted by 10000+ educators
							</p>
						</div>
						<div className='mt-4'>
							<h1 className='text-white text-center lg:text-[5rem] md:text-6xl sm:text-5xl text-4xl font-bold leading-none'>
								We make
								<br />
								Websites & Apps
								<br />
								for Educators
							</h1>
						</div>
						<div className='flex justify-center items-center mt-8 gap-8'>
							<Link to='/instructor/signup'>
								<button
									className='bg-white text-black py-4 px-12 font-semibold rounded-full transition-all duration-400 ease-in-out hover:bg-[#fffd63] hover:scale-110'
									style={{ boxShadow: '7px 7px #000' }}
								>
									Get Started
								</button>
							</Link>
							<button
								className='bg-white text-black py-4 px-12 font-semibold rounded-full transition-all duration-400 ease-in-out hover:bg-[#fffd63] hover:scale-110'
								style={{ boxShadow: '7px 7px #000' }}
							>
								Learn More
							</button>
						</div>
					</div>
					<div className='flex items-center justify-center absolute -bottom-10'>
						<div className='w-80 -rotate-12'>
							<img
								src='https://cdn.prod.website-files.com/65a21f6c73352e86a33fcd30/66c448cd03a59363f7816697_3.avif'
								alt=''
								className='w-full h-full'
							/>
						</div>
						<div className='w-80'>
							<img
								src='https://cdn.prod.website-files.com/65a21f6c73352e86a33fcd30/66c448cdb7d3d92aa0c4d5a7_1.avif'
								alt=''
								className='w-full h-full'
							/>
						</div>
						<div className='w-80 rotate-12'>
							<img
								src='https://cdn.prod.website-files.com/65a21f6c73352e86a33fcd30/66c448cddbbbe4334e2f6d8d_2.avif'
								alt=''
								className='w-full h-full'
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Hero;
