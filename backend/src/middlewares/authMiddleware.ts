import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (role: 'student' | 'instructor' | 'admin') => {
	return (req: Request, res: Response, next: NextFunction) => {
		const JWT_SECRET = process.env.JWT_SECRET as string;

		if (!JWT_SECRET) {
			console.error(
				'JWT_SECRET is not defined in environment variables.'
			);
			return res.status(500).json({
				message: 'Internal server error: JWT_SECRET not configured',
			});
		}

		try {
			const token = req.headers.authorization?.split(' ')[1];
			if (!token) {
				return res.status(401).json({
					message: 'Unauthorized: No token provided',
				});
			}

			const decoded = jwt.verify(token, JWT_SECRET) as {
				[key: string]: string;
			};

			if (!decoded || !decoded[role]) {
				return res.status(401).json({
					message: `Unauthorized: Invalid token for ${role}!`,
				});
			}

			req[`${role}Id`] = decoded[role];

			next();
		} catch (err) {
			console.error(err);
			res.status(401).json({
				message: 'Unauthorized',
			});
		}
	};
};

export const studentAuthMiddleware = authMiddleware('student');
export const instructorAuthMiddleware = authMiddleware('instructor');
export const adminAuthMiddleware = authMiddleware('admin');
