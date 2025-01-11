import { useState } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import { X } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config';
import { useParams } from 'react-router-dom';
import { Course } from '../../utils/types';

interface UpdateCourseProps {
	handleClickAway: () => void;
	course: Course;
}

const UpdateCourse = ({ handleClickAway, course }: UpdateCourseProps) => {
	const { courseId } = useParams();
	const [title, setTitle] = useState(course?.title);
	const [description, setDescription] = useState(course?.description);
	const [price, setPrice] = useState(course?.price?.toString());
	const [thumbnailUrl, setThumbnailUrl] = useState(course?.thumbnailUrl);
	const [level, setLevel] = useState(course?.level);
	const [type, setType] = useState(course?.type);
	const [startDate, setStartDate] = useState(course?.startDate);
	const [endDate, setEndDate] = useState(course?.endDate);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		const token = localStorage.getItem('token');

		const parsedPrice = parseFloat(price);
		if (isNaN(parsedPrice)) {
			alert('Invalid price');
			setIsSubmitting(false);
			return;
		}

		await axios
			.put(
				`${API_URL}/instructor/course/${courseId}`,
				{
					title,
					description,
					price: parsedPrice,
					thumbnailUrl,
					level,
					type,
					startDate,
					endDate,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then(() => {
				setIsSubmitting(false);
				alert('Course updated successfully.');
				handleClickAway();
			})
			.catch((err) => {
				console.error(err);
				setIsSubmitting(false);
			});
	};

	return (
		<>
			<div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg z-10' />
			<ClickAwayListener onClickAway={handleClickAway}>
				<div className='fixed inset-0 flex items-center justify-center z-20'>
					<div className='min-w-[35%] w-auto h-auto bg-white p-4 border rounded-lg drop-shadow-2xl shadow-2xl'>
						<div className='w-full'>
							<div className='flex items-center justify-between mb-4'>
								<h1 className='text-2xl font-medium'>
									Update Course
								</h1>
								<X
									className='cursor-pointer'
									onClick={handleClickAway}
								/>
							</div>
							<form
								method='POST'
								className='w-full space-y-4'
								onSubmit={handleSubmit}
							>
								<div className='text-sm space-y-1'>
									<label htmlFor=''>Title</label>
									<input
										type='text'
										className='w-full border outline-none rounded-md px-3 py-1'
										value={title}
										onChange={(e) =>
											setTitle(e.target.value)
										}
									/>
								</div>

								<div className='text-sm space-y-1'>
									<label htmlFor=''>Description</label>
									<textarea
										rows={4}
										className='w-full border outline-none rounded-md px-3 py-1 resize-none'
										value={description}
										onChange={(e) =>
											setDescription(e.target.value)
										}
									></textarea>
								</div>

								<div className='text-sm space-y-1'>
									<label htmlFor=''>Price</label>
									<input
										type='number'
										className='w-full border outline-none rounded-md px-3 py-1'
										value={price}
										onChange={(e) =>
											setPrice(e.target.value)
										}
									/>
								</div>

								<div className='text-sm space-y-1'>
									<label htmlFor=''>Thumbnail URL</label>
									<input
										type='text'
										className='w-full border outline-none rounded-md px-3 py-1'
										value={thumbnailUrl}
										onChange={(e) =>
											setThumbnailUrl(e.target.value)
										}
									/>
								</div>

								<div className='flex items-center justify-between text-sm gap-4'>
									<div className='w-full space-y-1'>
										<label htmlFor=''>Level</label>
										<select
											className='w-full border outline-none rounded-md px-3 py-1'
											value={level}
											onChange={(e) =>
												setLevel(e.target.value)
											}
										>
											<option value='' disabled selected>
												Select
											</option>
											<option value='BEGINNER'>
												Beginner
											</option>
											<option value='INTERMEDIATE'>
												Intermediate
											</option>
											<option value='ADVANCED'>
												Advanced
											</option>
										</select>
									</div>

									<div className='w-full space-y-1'>
										<label htmlFor=''>Type</label>
										<select
											className='w-full border outline-none rounded-md px-3 py-1'
											value={type}
											onChange={(e) =>
												setType(e.target.value)
											}
										>
											<option value='' disabled selected>
												Select
											</option>
											<option value='LIVE'>Live</option>
											<option value='RECORDED'>
												Recorded
											</option>
										</select>
									</div>
								</div>

								<div className='flex items-center justify-between text-sm gap-4'>
									<div className='w-full space-y-1'>
										<label htmlFor=''>Start Date</label>
										<input
											type='date'
											className='w-full border outline-none rounded-md px-3 py-1'
											value={startDate}
											onChange={(e) =>
												setStartDate(e.target.value)
											}
										/>
									</div>

									<div className='w-full space-y-1'>
										<label htmlFor=''>End Date</label>
										<input
											type='date'
											className='w-full border outline-none rounded-md px-3 py-1'
											value={endDate}
											onChange={(e) =>
												setEndDate(e.target.value)
											}
										/>
									</div>
								</div>

								<button className='w-full px-4 py-2 bg-blue-500 rounded-lg text-white'>
									{isSubmitting ? 'Submitting...' : 'Submit'}
								</button>
							</form>
						</div>
					</div>
				</div>
			</ClickAwayListener>
		</>
	);
};

export default UpdateCourse;
