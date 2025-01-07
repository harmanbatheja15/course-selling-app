import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import prisma from '../prisma';
import { extractSubdomain } from '../helper/subdomainHelper';

const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID!,
	key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

interface CustomRequest extends Request {
	studentId?: string;
	courseId?: string;
	orderId?: string;
}

// Get all courses
export const AllCourses = async (req: Request, res: Response) => {
	try {
		const subdomain = extractSubdomain(req);

		if (!subdomain) {
			res.status(400).json({ message: 'Invalid subdomain' });
			return;
		}

		const instructor = await prisma.instructor.findUnique({
			where: {
				slug: subdomain,
			},
		});

		if (!instructor) {
			res.status(400).json({
				message: 'Instructor not found!',
			});
			return;
		}

		const courses = await prisma.course.findMany({
			where: {
				instructorId: instructor.id,
			},
		});

		if (!courses) {
			res.status(404).json({ message: 'No courses found' });
			return;
		}

		res.status(200).json({
			message: 'Courses fetched successfully',
			courses,
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Error while fetching courses' });
	}
};

// Get a single course
export const GetCourse = async (req: Request, res: Response) => {
	const courseId = req.params.id;

	try {
		const course = await prisma.course.findUnique({
			where: {
				id: courseId,
			},
		});

		if (!course) {
			res.status(400).json({
				message: 'Course not found!',
			});
			return;
		}

		res.status(200).json({
			message: 'Course fetched successfully!',
			course,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: 'Something went wrong!',
		});
		return;
	}
};

// Purchase Course
export const EnrollInCourse = async (
	req: CustomRequest,
	res: Response
): Promise<void> => {
	try {
		const subdomain = extractSubdomain(req);

		if (!subdomain) {
			res.status(400).json({ message: 'Invalid subdomain' });
			return;
		}

		const instructor = await prisma.instructor.findUnique({
			where: {
				slug: subdomain,
			},
		});

		if (!instructor) {
			res.status(400).json({
				message: 'Instructor not found!',
			});
			return;
		}

		const course = await prisma.course.findUnique({
			where: {
				id: req.params.courseId,
			},
		});

		if (!course) {
			res.status(404).json({ message: 'Course not found' });
			return;
		}

		const student = await prisma.student.findUnique({
			where: {
				id: req.studentId,
			},
		});

		if (!student) {
			res.status(404).json({ message: 'Student not found' });
			return;
		}

		const order = await razorpay.orders.create({
			amount: course.price * 100,
			currency: 'INR',
			receipt: `receipt_${course.id}`,
		});

		if (!order) {
			res.status(400).json({ message: 'Error while creating order' });
			return;
		}

		req.courseId = course.id;
		req.orderId = order.id;

		// const enrollment = await prisma.enrollment.create({
		// 	data: {
		// 		studentId: student.id,
		// 		courseId: course.id,
		// 	},
		// });

		// res.status(200).json(enrollment);
		res.status(200).json({
			success: true,
			courseId: course.id,
			order,
		});
		return;
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Internal Server Error' });
		return;
	}
};

export const CapturePayment = async (
	req: CustomRequest,
	res: Response
): Promise<void> => {
	try {
		const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
			req.body;
		const orderId = req.orderId!;

		const body = razorpay_order_id + '|' + razorpay_payment_id;
		// const expectedSignature = crypto
		// 	.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
		// 	.update(body.toString())
		// 	.digest('hex');

		// const isAuthentic = expectedSignature === razorpay_signature;

		// if (!isAuthentic) {
		// 	res.status(400).json({ message: 'Payment verification failed' });
		// 	return;
		// }

		const payment = await razorpay.payments.fetch(razorpay_payment_id);

		if (payment && payment.status === 'authorized') {
			const captureResponse = await razorpay.payments.capture(
				razorpay_payment_id,
				payment.amount,
				payment.currency
			);

			// Create enrollment after successful capture
			const enrollment = await prisma.enrollment.create({
				data: {
					studentId: req.studentId!,
					courseId: req.courseId!,
				},
			});

			res.json({
				success: true,
				captureResponse,
				enrollment,
			});
			return;
		} else {
			res.status(400).json({
				message: 'Payment not found or not in authorized state',
				status: payment?.status,
			});
			return;
		}
	} catch (error) {
		console.error(error);
		if (error) {
			// If payment is already captured, we can consider this a success
			res.json({
				success: true,
				message: 'Payment was already captured',
			});
			return;
		}
		res.status(500).json({
			success: false,
			error: 'Error capturing payment',
			details: error ? error : 'Unknown error',
		});
		return;
	}
};
