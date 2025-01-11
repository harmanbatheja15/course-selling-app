export const Loading = () => {
	return (
		<>
			<div className='fixed inset-0 flex items-center justify-center z-50'>
				<div className='w-10 h-10 rounded-full animate-spin border-2 border-solid border-blue-500 border-t-transparent'></div>
			</div>
		</>
	);
};

export const Error = () => {
	return (
		<>
			<div className='fixed inset-0 flex items-center justify-center z-50'>
				<p className=''>An error occured! Please try again later...</p>
			</div>
		</>
	);
};
