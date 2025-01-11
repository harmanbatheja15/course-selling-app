import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { useParams } from 'react-router-dom';
import UpdateCourse from '../../components/instructor/UpdateCourse';
import { Plus } from 'lucide-react';
import { Error, Loading } from '../../components/LoadingError';
import { Course } from '../../utils/types';
import { useQuery } from '@tanstack/react-query';
import { getCourse } from '../../api/courses';

const ManageCourse = () => {
	const { courseId } = useParams();

	const { isLoading, error, refetch, data } = useQuery({
		queryKey: ['courses'],
		queryFn: () => getCourse(courseId!),
	});

	const [course, setCourse] = useState<Course>();
	const [isUpdateCourseModalOpen, setIsUpdateCourseModalOpen] =
		useState(false);
	const [folderName, setFolderName] = useState('');

	useEffect(() => {
		if (data?.course) {
			setCourse(data.course);
		}
	}, [data]);

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

	const handleClickAway = () => {
		setIsUpdateCourseModalOpen(false);
	};

	const handleAddFolder = async (e: any) => {
		e.preventDefault();
		try {
			await axios.post(
				`${API_URL}/course/createFolder/${courseId}`,
				{
					name: folderName,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							'token'
						)}`,
					},
				}
			);
			setFolderName('');
			await refetch();
			alert('Folder added successfully!');
		} catch (error) {
			console.log(error);
			alert('Something went wrong!');
		}
	};

	if (isLoading || !course) {
		return <Loading />;
	}

	if (error) {
		return <Error />;
	}

	return (
		<>
			<div className=''>
				<section className='text-gray-700 body-font overflow-hidden'>
					<div className='container px-5 pt-10 pb-24 mx-auto'>
						<div className='md:w-4/5 mx-auto flex flex-wrap items-center'>
							<img
								alt='ecommerce'
								className='md:w-1/2 w-full h-full object-contain object-center rounded border border-gray-200'
								src={course?.thumbnailUrl}
							/>
							<div className='md:w-1/2 w-full md:pl-10 md:py-6 mt-6 md:mt-0'>
								<h1 className='text-gray-900 text-4xl title-font font-bold mb-1'>
									{course?.title}
								</h1>
								<div className='flex mb-4'>
									<span className='title-font font-medium text-2xl text-gray-900'>
										₹{course?.price}
									</span>
								</div>
								<div className='flex'>
									<span className='bg-gray-200 rounded-full px-2 py-1 text-xs font-bold mr-2'>
										{course?.level}
									</span>
									<span className='bg-gray-200 rounded-full px-2 py-1 text-xs font-bold mr-2'>
										{course?.type}
									</span>
								</div>
								<p className='leading-relaxed mt-4'>
									{course?.description}
								</p>
								<div className='flex items-center'>
									{course?.startDate && (
										<span className='bg-gray-200 rounded-full px-2 py-1 text-xs font-bold mr-2'>
											{course.startDate.slice(0, 10)}
										</span>
									)}
									{course?.endDate && course?.startDate && (
										<>
											to
											<span className='bg-gray-200 rounded-full px-2 py-1 text-xs font-bold ml-2'>
												{course.endDate.slice(0, 10)}
											</span>
										</>
									)}
								</div>
								<div className='flex border-t border-gray-300 mt-5 pt-5'>
									<button
										type='submit'
										className='bg-gray-800 duration-200 focus:outline-none focus:shadow-outline font-medium h-12 hover:bg-gray-900 inline-flex items-center justify-center px-6 text-white tracking-wide transition rounded-lg'
										onClick={() =>
											setIsUpdateCourseModalOpen(true)
										}
									>
										Edit
									</button>
								</div>
							</div>
						</div>
					</div>
				</section>

				<div className='container md:w-4/5 mx-auto px-4'>
					<div className='flex md:flex-row flex-col md:items-center justify-between'>
						<div className='md:mb-0 mb-4'>
							<h1 className='text-2xl font-bold'>
								Course Content
							</h1>
						</div>
						<form
							action=''
							className='flex items-center gap-4'
							onSubmit={handleAddFolder}
						>
							<input
								type='text'
								className='border p-2 outline-none rounded-lg text-sm'
								placeholder='Folder Name'
								value={folderName}
								onChange={(e) => setFolderName(e.target.value)}
								required
							/>
							<button
								type='submit'
								className='flex items-center bg-black px-4 py-2 rounded-lg text-white'
							>
								<Plus size={18} />
								<span className='pl-2'>Add Folder</span>
							</button>
						</form>
					</div>

					<div className='w-full flex-wrap flex items-center gap-8 my-10'>
						{course?.courseFolders &&
							course?.courseFolders.map((folder, index) => (
								<div
									key={index}
									className='w-fit border py-4 px-8 rounded-full cursor-pointer hover:bg-gray-100'
								>
									<h1 className='text-xl font-bold'>
										{folder?.name}
									</h1>
								</div>
							))}
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
