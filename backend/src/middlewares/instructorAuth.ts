import { NextFunction, Request, Response } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

const instructorAuthMiddleware = (
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
			instructorId: string;
			role: string;
		};

		if (!decoded || !decoded.instructorId) {
			res.status(401).json({
				message: 'Unauthorized: Invalid token!',
			});
			return;
		}

		req.instructorId = decoded.instructorId;
		req.role = 'instructor';

		return next();
	} catch (err) {
		if (err instanceof TokenExpiredError) {
			res.status(401).json({
				message: 'Token expired',
			});
			return;
		}
		console.error(err);
		res.status(401).json({
			message: 'Unauthorized',
		});
		return;
	}
};

export default instructorAuthMiddleware;
