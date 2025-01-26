import { useState, useEffect } from 'react';
import { Course } from '../../utils/types';
import { useQuery } from '@tanstack/react-query';
import { getEnrolledCourses } from '../../api/courses';
import { Error, Loading } from '../LoadingError';
import { Link } from 'react-router-dom';

const EnrolledCourses = () => {
	const { isLoading, error, data } = useQuery({
		queryKey: ['enrolledCourses'],
		queryFn: getEnrolledCourses,
	});

	const [courses, setCourses] = useState<Course[]>([]);

	useEffect(() => {
		if (data?.enrollments) {
			setCourses(data.enrollments[0].enrollments.map((e: any) => e.course));
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
						<h1 className='text-2xl font-semibold'>
							You have not enrolled in any courses
						</h1>
						<p className='text-gray-500'>
							Explore and enroll in courses to get started
						</p>
					</div>
				)}
				{courses &&
					courses?.map((course, index) => (
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

export default EnrolledCourses;
