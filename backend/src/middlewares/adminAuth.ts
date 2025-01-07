import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const adminAuthMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const JWT_SECRET = process.env.JWT_SECRET as string;

	if (!JWT_SECRET) {
		console.error('JWT_SECRET is not defined in environment variables.');
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

		// Verify the token
		const decoded = jwt.verify(token, JWT_SECRET) as { admin: string };

		if (!decoded || !decoded.admin) {
			return res.status(401).json({
				message: 'Unauthorized: Invalid token!',
			});
		}

		req.adminId = decoded.admin;
		req.role = 'admin';

		return next();
	} catch (err) {
		console.log(err);
		res.status(401).json({
			message: 'Unauthorized',
		});
		return;
	}
};

export default adminAuthMiddleware;
