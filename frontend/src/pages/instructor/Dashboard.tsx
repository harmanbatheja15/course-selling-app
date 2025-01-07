import { useState, useEffect } from 'react';
import { Pencil, Plus } from 'lucide-react';
import AddCourse from '../../components/instructor/AddCourse';
import UpdateCourse from '../../components/instructor/UpdateCourse';
import useCourses from '../../hooks/useCourses';
import useStudents from '../../hooks/useInstructorUsers';

const Dashboard = () => {
	const { courses, loading, error, fetchCourses } = useCourses();
	const { students } = useStudents();
	const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
	const [isUpdateCourseModalOpen, setIsUpdateCourseModalOpen] =
		useState(false);

	const handleClickAway = () => {
		setIsAddCourseModalOpen(false);
		setIsUpdateCourseModalOpen(false);
		fetchCourses();
	};

	useEffect(() => {
		if (isAddCourseModalOpen || isUpdateCourseModalOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [isAddCourseModalOpen, isUpdateCourseModalOpen]);

	return (
		<>
			{/* Cards */}
			<div className='lg:px-8 px-4 pt-4'>
				<div className='min-w-screen flex items-center justify-center px-5 py-5'>
					<div className='w-full max-w-screen-lg'>
						<div className='-mx-2 md:flex'>
							<div className='w-full md:w-1/3 px-2'>
								<div className='rounded-lg shadow-sm mb-4'>
									<div className='rounded-lg bg-white shadow-lg md:shadow-xl relative overflow-hidden'>
										<div className='px-3 py-8 text-center relative'>
											<h4 className='text-sm uppercase text-gray-500 leading-tight'>
												Total Students
											</h4>
											<h3 className='text-3xl text-gray-700 font-semibold leading-tight mt-3'>
												{students.length}
											</h3>
										</div>
									</div>
								</div>
							</div>
							<div className='w-full md:w-1/3 px-2'>
								<div className='rounded-lg shadow-sm mb-4'>
									<div className='rounded-lg bg-white shadow-lg md:shadow-xl relative overflow-hidden'>
										<div className='px-3 py-8 text-center relative'>
											<h4 className='text-sm uppercase text-gray-500 leading-tight'>
												Total Courses
											</h4>
											<h3 className='text-3xl text-gray-700 font-semibold leading-tight mt-3'>
												{courses.length}
											</h3>
										</div>
									</div>
								</div>
							</div>
							<div className='w-full md:w-1/3 px-2'>
								<div className='rounded-lg shadow-sm mb-4'>
									<div className='rounded-lg bg-white shadow-lg md:shadow-xl relative overflow-hidden'>
										<div className='px-3 py-8 text-center relative'>
											<h4 className='text-sm uppercase text-gray-500 leading-tight'>
												Total Revenue
											</h4>
											<h3 className='text-3xl text-gray-700 font-semibold leading-tight mt-3'>
												₹2,00,000
											</h3>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Manage Courses */}
				<div className='max-w-screen-lg mx-auto mt-10'>
					<div className='flex items-center justify-between'>
						<h1 className='text-2xl font-bold'>Manage Courses</h1>
						<button
							className='flex items-center bg-black px-4 py-2 rounded-lg text-white'
							onClick={() => setIsAddCourseModalOpen(true)}
						>
							<Plus size={18} />
							<span className='pl-2'>Add Course</span>
						</button>
					</div>
					<div className='-mx-2 md:flex mt-8'>
						{!courses ? (
							<div className='text-center w-full'>
								<h1 className='text2xl font-semibold'>
									No courses found!
								</h1>
							</div>
						) : loading ? (
							<div className='text-center w-full'>
								<h1 className='text2xl font-semibold'>
									Loading...
								</h1>
							</div>
						) : error ? (
							<div className='text-center w-full'>
								<h1 className='text2xl font-semibold'>
									Something went wrong!
								</h1>
							</div>
						) : (
							courses.map((course, index) => (
								<div
									className='w-full md:w-1/3 px-2'
									key={index}
								>
									<div className='rounded-lg mb-4'>
										<div className='rounded-lg bg-white relative overflow-hidden border'>
											<div className=''>
												<img
													src={course.thumbnailUrl}
													alt=''
												/>
											</div>
											<div className='p-4 space-y-2'>
												<div className='flex items-center justify-between'>
													<h1 className='text-lg font-semibold'>
														{course.title}
													</h1>
													<Pencil
														size={16}
														className='cursor-pointer'
														onClick={() =>
															setIsUpdateCourseModalOpen(
																true
															)
														}
													/>
												</div>
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
											</div>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>

			{/* Add Course Modal */}
			{isAddCourseModalOpen && (
				<AddCourse handleClickAway={handleClickAway} />
			)}

			{/* Update Course Modal */}
			{isUpdateCourseModalOpen && (
				<UpdateCourse handleClickAway={handleClickAway} />
			)}
		</>
	);
};

export default Dashboard;
