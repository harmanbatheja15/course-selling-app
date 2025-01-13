import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

export interface CustomRequest extends Request {
	instructor?: any;
	studentId?: string;
}

export const checkSlug = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
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

	req.instructor = instructor;

	if (!instructor) {
		res.status(400).json({
			message: 'Instructor not found!',
		});
		return;
	}

	next();
};

const studentAuthMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const JWT_SECRET = process.env.JWT_SECRET as string;

	if (!JWT_SECRET) {
		console.error('JWT_SECRET is not defined in environment variables.');
		res.status(500).json({
			message: 'Internal server error: JWT_SECRET not configured',
		});
		return;
	}

	try {
		const token = req.headers.authorization?.split(' ')[1];
		if (!token) {
			res.status(401).json({
				message: 'Unauthorized: No token provided',
			});
			return;
		}

		// Verify the token
		const decoded = jwt.verify(token, JWT_SECRET) as {
			studentId: string;
			role: string;
		};

		if (!decoded || !decoded.studentId) {
			res.status(401).json({
				message: 'Unauthorized: Invalid token!',
			});
			return;
		}

		req.studentId = decoded.studentId;
		req.role = 'student';

		return next();
	} catch (err) {
		console.log(err);
		res.status(401).json({
			message: 'Unauthorized',
		});
		return;
	}
};

export default studentAuthMiddleware;
