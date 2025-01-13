import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import prisma from '../prisma';
import { extractSubdomain } from '../helper/subdomainHelper';
import { CreateFolderSchema } from '../zod/validator';
import { s3Client, uploadVideo } from '../helper/aws';
import {
	ListObjectsV2Command,
	ListObjectsV2CommandInput,
} from '@aws-sdk/client-s3';
import path from 'path';

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
export const AllCourses = async (
	req: Request,
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
export const GetCourse = async (req: Request, res: Response): Promise<void> => {
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

// Create a folder
export const CreateFolder = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const parsedData = CreateFolderSchema.safeParse(req.body);
		const { courseId } = req.params;

		if (!parsedData.success) {
			res.status(411).json({ msg: 'Invalid inputs' });
			return;
		}

		const instructor = await prisma.instructor.findUnique({
			where: {
				id: req.instructorId,
			},
		});

		if (!instructor) {
			res.status(400).json({
				message: 'Instructor not found!',
			});
			return;
		}

		const courses = await prisma.course.findFirst({
			where: {
				instructorId: instructor.id,
			},
		});

		if (!courses) {
			res.status(404).json({ message: 'No courses found' });
			return;
		}

		const folderPresent = await prisma.courseFolder.findFirst({
			where: {
				courseId,
				name: parsedData.data.name,
			},
		});

		if (folderPresent) {
			res.status(400).json({
				message: 'Folder with similar name already exists',
			});
			return;
		}

		const folder = await prisma.courseFolder.create({
			data: {
				name: parsedData.data.name,
				courseId: courseId,
			},
		});

		res.json({ message: 'Folder created successfully', folder });
	} catch (err) {
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

// Upload video
export const UploadVideo = async (
	req: CustomRequest,
	res: Response
): Promise<void> => {
	try {
		const { name, type, courseId, folderId } = req.body;
		const video = req.file;

		if (!video) {
			res.status(400).json({ message: 'No video found' });
			return;
		}

		if (!courseId || !folderId) {
			res.status(400).json({ message: 'Missing courseId or folderId' });
			return;
		}

		const course = await prisma.course.findUnique({
			where: {
				id: courseId,
			},
		});

		if (!course) {
			res.status(404).json({ message: 'Course not found' });
			return;
		}

		const folder = await prisma.courseFolder.findUnique({
			where: {
				id: folderId,
			},
		});

		if (!folder) {
			res.status(404).json({ message: 'Folder not found' });
			return;
		}

		const result = await uploadVideo(
			req.instructorId!,
			courseId,
			folder.name,
			video.buffer,
			name
		);

		const videoEntry = await prisma.courseContent.create({
			data: {
				name: name,
				url: result.videoUrl,
				type: type,
				courseFolderId: folderId,
			},
		});

		res.status(200).json({
			message: 'Video uploaded successfully',
			video: videoEntry,
			result,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

// List folder contents
export const ListFolderContents = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { courseId, folderName } = req.params;
		// const { folderName } = req.query;

		const sanitizedFolderName = path
			.normalize(folderName)
			.replace(/^(\.\.(\/|\\|$))+/, '');
		const prefix = `${req.instructorId}/${courseId}/${sanitizedFolderName}`;

		const params: ListObjectsV2CommandInput = {
			Bucket: process.env.AWS_BUCKET_NAME!,
			Prefix: prefix,
			Delimiter: '/',
		};

		const data = await s3Client.send(new ListObjectsV2Command(params));

		const folders = (data.CommonPrefixes || []).map(
			(prefix) => prefix.Prefix!.split('/').slice(-2)[0]
		);

		const files = (data.Contents || [])
			.map((item) => ({
				name: item.Key!.split('/').pop() || '',
				size: item.Size || 0,
				lastModified: item.LastModified || new Date(),
			}))
			.filter((item) => item.name);

		res.status(200).json({
			folders,
			files,
			path: prefix,
		});
	} catch (error) {
		console.error('Error listing folder contents:', error);
		throw new Error(
			`Failed to list folder contents: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		);
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

		const enrollment = await prisma.enrollment.create({
			data: {
				studentId: student.id,
				courseId: course.id,
			},
		});

		res.status(200).json({
			success: true,
			courseId: course.id,
			order,
			enrollment,
		});
		return;
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Internal Server Error' });
		return;
	}
};

// Capture Payment
export const CapturePayment = async (
	req: CustomRequest,
	res: Response
): Promise<void> => {
	try {
		const { razorpay_payment_id, razorpay_order_id } = req.body;

		const body = razorpay_order_id + '|' + razorpay_payment_id;

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
