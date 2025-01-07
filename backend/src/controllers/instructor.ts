import { Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
	SignInSchema,
	InstructorSignUpSchema,
	CourseSchema,
} from '../zod/validator';
import { extractSubdomain } from '../helper/subdomainHelper';

function generateSlug(organization: string): string {
	return organization
		.toLowerCase()
		.trim()
		.replace(/[\s]+/g, '-') // Replace spaces with hyphens
		.replace(/[^a-z0-9-]/g, ''); // Remove non-alphanumeric characters
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	throw new Error('JWT_SECRET is not defined in environment variables.');
}

// Get Instructor Students
export const getInstructorStudents = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const instructor = await prisma.instructor.findUnique({
			where: {
				id: req.instructorId,
			},
			select: {
				students: true,
			},
		});

		if (!instructor) {
			res.status(400).json({
				message: 'Instructor not found!',
			});
			return;
		}

		res.status(200).json({
			message: 'Students fetched successfully!',
			students: instructor?.students,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: 'Something went wrong!',
		});
		return;
	}
};

export const getInstructor = async (
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
				id: req.instructorId,
			},
		});

		if (!instructor) {
			res.status(400).json({ message: 'Instructor not found' });
			return;
		}

		res.status(200).json({
			message: 'Instructor fetched successfully!',
			instructor,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: 'Something went wrong!',
		});
		return;
	}
};

// Signup
export const Signup = async (req: Request, res: Response): Promise<void> => {
	const parsedData = InstructorSignUpSchema.safeParse(req.body);

	if (!parsedData.success) {
		res.status(400).json({
			message: 'Invalid credentials',
		});
		return;
	}

	try {
		const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
		const slug = generateSlug(parsedData.data.organization);

		const existingInstructor = await prisma.instructor.findUnique({
			where: {
				email: parsedData.data.email,
			},
		});

		if (existingInstructor) {
			res.status(400).json({
				message: 'Instructor already exists!',
			});
			return;
		}

		const instructor = await prisma.instructor.create({
			data: {
				name: parsedData.data.name,
				email: parsedData.data?.email,
				password: hashedPassword,
				organization: parsedData.data.organization,
				slug: slug,
			},
		});

		const token = jwt.sign(
			{ instructorId: instructor.id, role: 'instructor' },
			JWT_SECRET!
		);

		if (!token) {
			res.status(400).json({
				message: 'Something went wrong!',
			});
			return;
		}

		res.status(200).json({
			message: 'Signed up Successfully!',
			instructorId: instructor.id,
			token,
			instructor,
		});
		return;
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: 'Internal Server Error',
		});
	}
};

// Signin
export const Signin = async (req: Request, res: Response): Promise<void> => {
	const parsedData = SignInSchema.safeParse(req.body);

	if (!parsedData.success) {
		res.status(400).json({
			message: 'Invalid credentials',
		});
		return;
	}

	try {
		const instructor = await prisma.instructor.findUnique({
			where: {
				email: parsedData.data.email,
			},
		});

		if (!instructor) {
			res.status(400).json({
				message: 'Instructor not found!',
			});
			return;
		}

		const hashedPassword = await bcrypt.compare(
			parsedData.data.password,
			instructor.password
		);

		if (!hashedPassword) {
			res.status(401).json({ message: 'Invalid credentials' });
			return;
		}

		const token = jwt.sign(
			{
				instructorId: instructor.id,
				role: 'instructor',
			},
			JWT_SECRET!
		);

		instructor.password = '';

		res.status(200).json({
			message: 'Signed in Successfully!',
			instructorId: instructor.id,
			token,
			instructor: instructor,
		});
		return;
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: 'Something went wrong!',
		});
	}
};

// Add Course
export const AddCourse = async (req: Request, res: Response): Promise<void> => {
	const parsedData = CourseSchema.safeParse(req.body);

	if (!parsedData.success) {
		console.log(parsedData.error);
		res.status(400).json({
			message: 'Invalid data!',
		});
		return;
	}

	const parsedStartDate = parsedData.data.startDate
		? new Date(parsedData.data.startDate)
		: null;
	const parsedEndDate = parsedData.data.endDate
		? new Date(parsedData.data.endDate)
		: null;

	try {
		const course = await prisma.course.create({
			data: {
				title: parsedData.data.title,
				description: parsedData.data.description,
				price: parsedData.data.price,
				thumbnailUrl: parsedData.data.thumbnailUrl,
				level: parsedData.data.level,
				startDate: parsedStartDate,
				endDate: parsedEndDate,
				instructorId: req.instructorId!,
			},
		});

		if (!course) {
			res.status(400).json({
				message: 'Failed to add course!',
			});
			return;
		}

		res.status(200).json({
			message: 'Course added successfully!',
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

// Update Course
export const UpdateCourse = async (
	req: Request,
	res: Response
): Promise<void> => {
	const courseId = req.params.id;
	const parsedData = CourseSchema.safeParse(req.body);

	if (!parsedData.success) {
		res.status(400).json({
			message: 'Invalid inputs',
		});
		return;
	}

	const parsedStartDate = parsedData.data.startDate
		? new Date(parsedData.data.startDate)
		: null;
	const parsedEndDate = parsedData.data.endDate
		? new Date(parsedData.data.endDate)
		: null;

	try {
		const course = await prisma.course.update({
			where: {
				id: courseId,
				instructorId: req.instructorId,
			},
			data: {
				title: parsedData.data.title,
				description: parsedData.data.description,
				price: parsedData.data.price,
				thumbnailUrl: parsedData.data.thumbnailUrl,
				level: parsedData.data.level,
				startDate: parsedStartDate,
				endDate: parsedEndDate,
			},
		});

		if (!course) {
			res.status(400).json({
				message: 'Failed to update course!',
			});
			return;
		}

		res.status(200).json({
			message: 'Course updated successfully!',
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

// Get All Courses
export const GetCourses = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const instructor = await prisma.instructor.findUnique({
			where: {
				id: req.instructorId,
			},
			include: {
				courses: true,
			},
		});

		if (!instructor) {
			res.status(400).json({
				message: 'Instructor not found!',
			});
			return;
		}

		res.status(200).json({
			message: 'Courses fetched successfully!',
			courses: instructor?.courses,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: 'Something went wrong!',
		});
		return;
	}
};

// Get Single Course
export const GetCourse = async (req: Request, res: Response): Promise<void> => {
	const courseId = req.params.id;
	const instructorId = req.instructorId;

	try {
		const course = await prisma.course.findUnique({
			where: {
				id: courseId,
				instructorId: instructorId,
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

// Delete Course
export const DeleteCourse = async (
	req: Request,
	res: Response
): Promise<void> => {
	const courseId = req.params.id;
	const instructorId = req.instructorId;

	try {
		await prisma.course.delete({
			where: {
				id: courseId,
				instructorId: instructorId,
			},
		});

		res.status(200).json({
			message: 'Course deleted successfully!',
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: 'Something went wrong!',
		});
		return;
	}
};
