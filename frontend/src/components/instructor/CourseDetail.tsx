import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Course } from '../../hooks/useCourses';
import axios from 'axios';
import { API_URL } from '../../config';

const CourseDetail = () => {
	const { courseId } = useParams();

	const [course, setCourse] = useState<Course>();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchCourses = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await axios.get(`${API_URL}/course/${courseId}`);
			console.log(response.data);
			setCourse(response.data.course);
		} catch (err) {
			setError('Failed to fetch courses');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCourses();
	}, []);

	return (
		<>
			<section className='text-gray-700 body-font overflow-hidden'>
				<div className='container px-5 py-24 mx-auto'>
					{error && <p className='text-center'>Error</p>}
					{loading && <p className='text-center'>Loading...</p>}
					{course && (
						<div className='lg:w-4/5 mx-auto flex flex-wrap items-center'>
							<img
								alt='ecommerce'
								className='lg:w-1/2 w-full h-full object-contain object-center rounded border border-gray-200'
								src={course?.thumbnailUrl}
							/>
							<div className='lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0'>
								{course?.level && (
									<h2 className='text-sm title-font text-gray-700 tracking-widest'>
										{course?.level}
									</h2>
								)}
								<h1 className='text-gray-900 text-4xl title-font font-bold mb-1'>
									{course?.title}{' '}
									{course?.type && '-' + course?.type}
								</h1>
								<div className='flex mb-4'>
									<span className='title-font font-medium text-2xl text-gray-900'>
										₹{course?.price}
									</span>
								</div>
								<p className='leading-relaxed'>
									{course?.description}
								</p>
								{course?.startDate && (
									<p className='mt-3'>
										<span className='bg-gray-200 rounded-full py-1 px-3'>
											{course?.startDate}
										</span>{' '}
										to{' '}
										<span className='bg-gray-200 rounded-full py-1 px-3'>
											{course?.endDate}
										</span>
									</p>
								)}
								<div className='flex border-t border-gray-300 mt-5 pt-5'>
									<button
										type='submit'
										className='bg-gray-800 duration-200 focus:outline-none focus:shadow-outline font-medium h-12 hover:bg-gray-900 inline-flex items-center justify-center px-6 text-white tracking-wide transition w-full'
									>
										Buy Now
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</section>
		</>
	);
};

export default CourseDetail;
