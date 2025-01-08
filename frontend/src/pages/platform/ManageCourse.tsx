import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import useCourses, { Course } from '../../hooks/useCourses';
import { useParams } from 'react-router-dom';
import UpdateCourse from '../../components/instructor/UpdateCourse';
import { Plus } from 'lucide-react';

const ManageCourse = () => {
	const { fetchCourses } = useCourses();
	const [course, setCourse] = useState<Course>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isUpdateCourseModalOpen, setIsUpdateCourseModalOpen] =
		useState(false);

	const [folder, setFolder] = useState('');

	const { courseId } = useParams();

	const fetchCourse = async () => {
		try {
			const { data } = await axios.get(
				`${API_URL}/instructor/course/${courseId}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							'token'
						)}`,
					},
				}
			);
			setCourse(data.course);
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCourse();
	}, [courseId]);

	const handleClickAway = () => {
		setIsUpdateCourseModalOpen(false);
		fetchCourses();
	};

	useEffect(() => {
		if (isUpdateCourseModalOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [isUpdateCourseModalOpen]);

	const handleAddFolder = async (e: any) => {
		e.preventDefault();
		await axios
			.post(
				`${API_URL}/course/createFolder/${courseId}`,
				{
					name: folder,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							'token'
						)}`,
					},
				}
			)
			.then(() => {
				setFolder('');
				alert('Folder added successfully!');
			})
			.catch((error) => {
				console.log(error);
				alert('Something went wrong!');
			});
	};

	return (
		<>
			<div className=''>
				{loading && <p className='text-center'>Loading...</p>}
				{error && <p className='text-center'>Something went wrong!</p>}
				{course && (
					<section className='text-gray-700 body-font overflow-hidden'>
						<div className='container px-5 py-24 mx-auto'>
							{error && <p className='text-center'>Error</p>}
							{loading && (
								<p className='text-center'>Loading...</p>
							)}
							{course && (
								<div className='md:w-4/5 mx-auto flex flex-wrap items-center'>
									<img
										alt='ecommerce'
										className='md:w-1/2 w-full h-full object-contain object-center rounded border border-gray-200'
										src={course?.thumbnailUrl}
									/>
									<div className='md:w-1/2 w-full md:pl-10 md:py-6 mt-6 md:mt-0'>
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
										<div className='flex items-center mt-3'>
											{course?.startDate && (
												<span className='bg-gray-200 rounded-full px-2 py-1 text-xs font-bold mr-2'>
													{course.startDate.slice(
														0,
														10
													)}
												</span>
											)}
											{course?.endDate &&
												course?.startDate && (
													<>
														to
														<span className='bg-gray-200 rounded-full px-2 py-1 text-xs font-bold ml-2'>
															{course.endDate.slice(
																0,
																10
															)}
														</span>
													</>
												)}
										</div>
										<div className='flex border-t border-gray-300 mt-5 pt-5'>
											<button
												type='submit'
												className='bg-gray-800 duration-200 focus:outline-none focus:shadow-outline font-medium h-12 hover:bg-gray-900 inline-flex items-center justify-center px-6 text-white tracking-wide transition rounded-lg'
												onClick={() =>
													setIsUpdateCourseModalOpen(
														true
													)
												}
											>
												Edit
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					</section>
				)}

				<div className=''>
					{/* Course Content */}
					<div className='container mx-auto px-4'>
						<div className='flex items-center justify-between'>
							<div className=''>
								<h1 className='text-2xl font-bold'>
									Course Content
								</h1>
							</div>
							<div className='flex items-center gap-4'>
								<input
									type='text'
									className='border p-2 outline-none rounded-lg text-sm'
									placeholder='Folder Name'
									value={folder}
									onChange={(e) => setFolder(e.target.value)}
								/>
								<button
									className='flex items-center bg-black px-4 py-2 rounded-lg text-white'
									onClick={handleAddFolder}
								>
									<Plus size={18} />
									<span className='pl-2'>Add Folder</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Update Course Modal */}
			{isUpdateCourseModalOpen && (
				<UpdateCourse
					handleClickAway={handleClickAway}
					course={course!}
				/>
			)}
		</>
	);
};

export default ManageCourse;
