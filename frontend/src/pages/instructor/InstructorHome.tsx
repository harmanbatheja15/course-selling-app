import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../../utils/types';
import { getCoursesByInstructor } from '../../api/courses';
import { useQuery } from '@tanstack/react-query';
import { Error, Loading } from '../../components/LoadingError';

const InstructorHome = () => {
	const { isLoading, error, data } = useQuery({
		queryKey: ['courses'],
		queryFn: getCoursesByInstructor,
	});

	const [courses, setCourses] = useState<Course[]>([]);

	useEffect(() => {
		if (data?.courses) {
			setCourses(data.courses);
		}
	}, [data]);

	if (isLoading || !courses) {
		return <Loading />;
	}

	if (error) {
		return <Error />;
	}

	return (
		<>
			<div className='-mx-2 md:flex justify-center mt-8'>
				{!courses.length && (
					<div className='text-center'>
						<h1 className='text-2xl font-semibold'>No courses available!</h1>
					</div>
				)}
				{courses.map((course, index) => (
					<div className='w-full md:w-1/3 px-2' key={index}>
						<div className='rounded-lg mb-4'>
							<div className='rounded-lg bg-white relative overflow-hidden border'>
								<Link to={`/course/${course.id}`}>
									<div className=''>
										<img src={course.thumbnailUrl} alt='' />
									</div>
									<div className='p-4 space-y-2'>
										<h1 className='text-lg font-semibold'>{course.title}</h1>
										<p>{course.description}</p>
										{course.startDate && (
											<div className='flex items-center text-sm'>
												Starts on: &nbsp;
												<span className='bg-gray-200 rounded-full px-2 py-1 text-xs font-bold'>
													{course.startDate.slice(0, 10)}
												</span>
											</div>
										)}
										<p className='text-base font-medium'>₹{course.price}</p>
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
