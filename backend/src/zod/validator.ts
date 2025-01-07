import z from 'zod';

declare global {
	namespace Express {
		export interface Request {
			studentId?: string;
			instructorId?: string;
			adminId?: string;
			role?: string;
		}
	}
}

export const StudentSignUpSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters long!'),
	email: z.string().email('Invalid email!'),
	password: z.string().min(6, 'Password must be at least 6 characters long!'),
	avatar: z.string().url('Invalid URL!').optional(),
	// password: z.string().min(6).regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/\d/, "Password must contain at least one number").regex(/[@$!%*?&]/, "Password must contain at least one special character"),
});

export const SignInSchema = z.object({
	email: z.string().email('Invalid email!'),
	password: z.string().min(6, 'Password must be at least 6 characters long!'),
});

export const InstructorSignUpSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters long!'),
	email: z.string().email('Invalid email!'),
	password: z.string().min(6, 'Password must be at least 6 characters long!'),
	organization: z
		.string()
		.min(2, 'Organization name must be at least 2 characters long!'),
	// password: z.string().min(6).regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/\d/, "Password must contain at least one number").regex(/[@$!%*?&]/, "Password must contain at least one special character"),
});

export const CourseSchema = z.object({
	title: z.string().min(2, 'Title must be at least 2 characters long!'),
	description: z
		.string()
		.min(10, 'Description must be at least 10 characters long!'),
	price: z.number().min(0, 'Price must be a positive number!'),
	thumbnailUrl: z.string().url('Invalid URL!'),
	// level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
	level: z.string().optional(),
	type: z.enum(['Live', 'Recorded']).optional(),
	startDate: z
		.string()
		.refine((val) => !isNaN(Date.parse(val)), 'Start date is not valid!')
		.optional(),
	endDate: z
		.string()
		.refine((val) => !isNaN(Date.parse(val)), 'End date is not valid!')
		.optional(),
});

export const UpdateStudentSchema = z.object({
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters long!')
		.optional(),
	email: z.string().email('Invalid email!').optional(),
	avatar: z.string().url('Invalid URL!').optional(),
});
