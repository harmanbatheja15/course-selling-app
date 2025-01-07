import { features } from '../../data';

const Features = () => {
	return (
		<>
			<div className='py-36'>
				<div className=''>
					<h1 className='text-[3.5rem] font-bold text-center'>
						Diversify Your{' '}
						<span className='text-[#ef5332]'>Revenue</span>
					</h1>
					<h2 className='text-base text-center'>
						Unlock your content's full potential, reap the rewards
					</h2>
				</div>
				<div className='max-w-full w-full mt-16 px-8'>
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
						{features.map((feature, index) => (
							<div
								className='bg-[#f8f7f1] rounded-2xl py-6 px-4 transition-all duration-300 ease-in-out'
								key={index}
							>
								<div>
									<img
										src={feature.image}
										alt=''
										className='w-full h-full object-cover rounded-xl'
									/>
								</div>
								<div className='space-y-2'>
									<h1 className='text-[1.35rem] font-semibold'>
										{feature.title}
									</h1>
									<p className='text-base'>
										{feature.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default Features;
