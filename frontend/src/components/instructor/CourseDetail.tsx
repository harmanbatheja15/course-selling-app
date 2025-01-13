import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Course } from '../../utils/types';
import { Error, Loading } from '../../components/LoadingError';
import { useQuery } from '@tanstack/react-query';
import { getCourseDetail } from '../../api/courses';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { API_URL, RAZORPAY_KEY_ID } from '../../config';

const CourseDetail = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const { courseId } = useParams();

	const { isLoading, error, data } = useQuery({
		queryKey: ['courses'],
		queryFn: () => getCourseDetail(courseId!),
	});

	const [course, setCourse] = useState<Course>();
	const [isEnrolled, setIsEnrolled] = useState<boolean>(false);

	useEffect(() => {
		if (data?.course) {
			setCourse(data.course);
		}
	}, [data]);

	const checkEnrollment = async () => {
		try {
			const response = await axios.get(`${API_URL}/student/${courseId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			setIsEnrolled(response.data.enrolled);
		} catch (error) {
			console.error('Error checking enrollment:', error);
		}
	};

	useEffect(() => {
		checkEnrollment();
	}, [isAuthenticated, courseId]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${API_URL}/course/enroll/${course?.id}`,
				{
					amount: course?.price,
					currency: 'INR',
					receipt: `course-${course?.id}`,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem(
							'token'
						)}`,
					},
				}
			);

			if (response.data.success) {
				openRazorpay(
					response.data.order.id,
					response.data.order.amount,
					response.data.order.currency
				);
			} else {
				console.log('Error creating order:', response.data.details);
			}
		} catch (err) {
			console.error('Error creating order:', err);
		}
	};

	const openRazorpay = (
		orderId: number | string,
		amount: number,
		currency: string
	) => {
		const options = {
			key: RAZORPAY_KEY_ID,
			amount: amount,
			currency: currency,
			name: 'Courses',
			description: `Payment for Course - ${course?.title}`,
			order_id: orderId,
			handler: async function (response: any) {
				try {
					const captureResponse = await axios.post(
						`${API_URL}/course/capturePayment`,
						{
							payment_id: response.razorpay_payment_id,
							amount: amount / 100,
						},
						{
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${localStorage.getItem(
									'token'
								)}`,
							},
						}
					);

					if (captureResponse.data.success) {
						alert('Payment successful');
						navigate('/enrolled-courses');
					} else {
						console.log(
							'Error capturing payment:',
							captureResponse.data.details
						);
					}
				} catch (error) {
					console.error('Error capturing payment:', error);
				}
			},
			// prefill: {
			// 	name: name,
			// 	email: email,
			// 	contact: phone,
			// },
			theme: {
				color: '#F37254',
			},
		};

		const rzp = new window.Razorpay(options);
		rzp.open();
	};

	if (isLoading || !course) {
		return <Loading />;
	}

	if (error) {
		return <Error />;
	}

	return (
		<>
			<section className='text-gray-700 body-font overflow-hidden'>
				<div className='container px-5 py-24 mx-auto'>
					{course && (
						<div className='lg:w-4/5 mx-auto flex flex-wrap items-center'>
							<img
								alt='ecommerce'
								className='lg:w-1/2 w-full h-full object-contain object-center rounded border border-gray-200'
								src={course?.thumbnailUrl}
							/>
							<div className='lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0'>
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
								<div className='flex items-center mt-3'>
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
								{isAuthenticated && !isEnrolled && (
									<div className='flex border-t border-gray-300 mt-5 pt-5'>
										<button
											type='submit'
											onClick={handleSubmit}
											className='bg-gray-800 duration-200 focus:outline-none focus:shadow-outline font-medium h-12 hover:bg-gray-900 inline-flex items-center justify-center px-6 text-white tracking-wide transition w-full'
										>
											Buy Now
										</button>
									</div>
								)}

								{isAuthenticated && isEnrolled && (
									<Link
										to={'/enrolled-courses'}
										className='flex border-t border-gray-300 mt-5 pt-5'
									>
										<button
											type='submit'
											className='bg-gray-800 duration-200 focus:outline-none focus:shadow-outline font-medium h-12 hover:bg-gray-900 inline-flex items-center justify-center px-6 text-white tracking-wide transition w-full'
										>
											Enrolled
										</button>
									</Link>
								)}

								{!isAuthenticated && (
									<Link
										to={'/signin'}
										className='flex border-t border-gray-300 mt-5 pt-5'
									>
										<button
											type='submit'
											className='bg-gray-800 duration-200 focus:outline-none focus:shadow-outline font-medium h-12 hover:bg-gray-900 inline-flex items-center justify-center px-6 text-white tracking-wide transition w-full'
										>
											Login to Buy
										</button>
									</Link>
								)}
							</div>
						</div>
					)}
				</div>
			</section>
		</>
	);
};

export default CourseDetail;
