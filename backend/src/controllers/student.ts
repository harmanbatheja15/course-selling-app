import { Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
	SignInSchema,
	StudentSignUpSchema,
	UpdateStudentSchema,
} from '../zod/validator';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	throw new Error('JWT_SECRET is not defined in environment variables.');
}

// Signup
export const Signup = async (req: Request, res: Response): Promise<void> => {
	const parsedData = StudentSignUpSchema.safeParse(req.body);

	if (!parsedData.success) {
		res.status(400).json({
			message: 'Invalid credentials',
		});
		return;
	}

	try {
		const host = req.headers.host;
		const subdomain = host?.includes('.') ? host.split('.')[0] : null;

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

		const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

		const existingStudent = await prisma.student.findUnique({
			where: {
				email_instructorId: {
					email: parsedData.data.email,
					instructorId: instructor.id,
				},
			},
		});

		if (existingStudent) {
			res.status(400).json({
				message: 'Student already exists!',
			});
			return;
		}

		const student = await prisma.student.create({
			data: {
				name: parsedData.data.name,
				email: parsedData.data?.email,
				password: hashedPassword,
				instructorId: instructor?.id,
			},
		});

		const token = jwt.sign(
			{ studentId: student.id, role: 'student' },
			JWT_SECRET!
		);

		if (!token) {
			res.status(500).json({
				message: 'Something went wrong!',
			});
			return;
		}

		res.status(200).json({
			message: 'Signed up Successfully!',
			studentId: student.id,
			token,
		});
		return;
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Internal Server Error',
		});
		return;
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
		const host = req.headers.host;
		const subdomain = host?.includes('.') ? host.split('.')[0] : null;

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

		const student = await prisma.student.findFirst({
			where: {
				email: parsedData.data.email,
				instructorId: instructor?.id,
			},
		});

		if (!student) {
			res.status(400).json({
				message: 'Invalid credentials',
			});
			return;
		}

		const isPasswordValid = await bcrypt.compare(
			parsedData.data.password,
			student.password
		);

		if (!isPasswordValid) {
			res.status(401).json({ message: 'Invalid credentials' });
			return;
		}

		const token = jwt.sign(
			{
				studentId: student.id,
				role: 'student',
			},
			JWT_SECRET!
		);

		res.status(200).json({
			message: 'Signed in Successfully!',
			studentId: student.id,
			token,
		});
		return;
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Something went wrong!',
		});
		return;
	}
};

// Update Profile
export const UpdateProfile = async (
	req: Request,
	res: Response
): Promise<void> => {
	const parsedData = UpdateStudentSchema.safeParse(req.body);

	if (!parsedData.success) {
		res.status(400).json({
			message: 'Invalid data',
		});
		return;
	}

	try {
		const student = await prisma.student.findUnique({
			where: {
				id: req.studentId,
			},
		});

		if (!student) {
			res.status(404).json({ message: 'Student not found' });
			return;
		}

		const updatedStudent = await prisma.student.update({
			where: {
				id: req.studentId,
			},
			data: {
				name: parsedData.data.name,
				email: parsedData.data.email,
			},
		});

		res.status(200).json(updatedStudent);
		return;
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Internal Server Error' });
		return;
	}
};

// Get Profile
export const GetProfile = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const host = req.headers.host;
		const subdomain = host?.includes('.') ? host.split('.')[0] : null;

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

		const student = await prisma.student.findUnique({
			where: {
				id: req.studentId,
				instructorId: instructor.id,
			},
		});

		if (!student) {
			res.status(404).json({ message: 'Student not found' });
			return;
		}

		res.status(200).json(student);
		return;
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Internal Server Error' });
		return;
	}
};

// Get All Enrolled Courses
export const getEnrolledCourses = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const host = req.headers.host;
		const subdomain = host?.includes('.') ? host.split('.')[0] : null;

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

		const enrollments = await prisma.student.findMany({
			where: {
				id: req.studentId,
				instructorId: instructor.id,
			},
			select: {
				enrollments: true,
			},
		});

		res.status(200).json({
			message: 'All Enrolled Courses',
			enrollments,
		});
		return;
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Internal Server Error' });
		return;
	}
};

// Get Enrolled Course
export const getEnrolledCourse = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const host = req.headers.host;
		const subdomain = host?.includes('.') ? host.split('.')[0] : null;

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

		const enrollment = await prisma.enrollment.findFirst({
			where: {
				studentId: req.studentId,
				courseId: req.params.courseId,
			},
		});

		if (!enrollment) {
			res.status(404).json({ message: 'Course not found' });
			return;
		}

		res.status(200).json({
			message: 'Enrolled Course',
			enrollment,
		});
		return;
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Internal Server Error' });
		return;
	}
};
