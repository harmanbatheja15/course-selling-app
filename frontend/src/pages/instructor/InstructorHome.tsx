import { useState, useEffect } from 'react';
import { Course } from '../../hooks/useCourses';
import axios from 'axios';
import { API_URL } from '../../config';
import { Link } from 'react-router-dom';

const InstructorHome = () => {
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchCourses = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await axios.get(`${API_URL}/course`);
			console.log(response.data);
			setCourses(response.data.courses);
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
			<div className='-mx-2 md:flex justify-center mt-8'>
				{error && <p className='text-center'>Error</p>}
				{loading && <p className='text-center'>Loading...</p>}
				{courses.map((course, index) => (
					<div className='w-full md:w-1/3 px-2' key={index}>
						<div className='rounded-lg mb-4'>
							<div className='rounded-lg bg-white relative overflow-hidden border'>
								<Link to={`/course/${course.id}`}>
									<div className=''>
										<img src={course.thumbnailUrl} alt='' />
									</div>
									<div className='p-4 space-y-2'>
										<h1 className='text-lg font-semibold'>
											{course.title}
										</h1>
										<p>{course.description}</p>
										{course.startDate && (
											<div className='flex items-center text-sm'>
												Starts on: &nbsp;
												<span className='bg-gray-200 rounded-full px-2 py-1 text-xs font-bold'>
													{course.startDate.slice(
														0,
														10
													)}
												</span>
											</div>
										)}
										<p className='text-base font-medium'>
											₹{course.price}
										</p>
									</div>
								</Link>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default InstructorHome;
