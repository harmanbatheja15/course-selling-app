import { Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const Signup = async (req: Request, res: Response) => {
	const { name, email, password } = req.body;

	const JWT_SECRET = process.env.JWT_SECRET;

	try {
		const hashedPassword = await bcrypt.hash(password, 10);

		const existingAdmin = await prisma.admin.findUnique({
			where: {
				email: email,
			},
		});

		if (existingAdmin) {
			res.status(400).json({
				message: 'Admin already exists!',
			});
			return;
		}

		const admin = await prisma.admin.create({
			data: {
				name: name,
				email: email,
				password: hashedPassword,
			},
		});

		const token = jwt.sign(
			{ adminId: admin.id, role: 'admin' },
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
			adminId: admin.id,
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

export const Signin = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	const JWT_SECRET = process.env.JWT_SECRET;

	try {
		const admin = await prisma.admin.findUnique({
			where: {
				email: email,
			},
		});

		if (!admin) {
			res.status(404).json({
				message: 'Admin not found!',
			});
			return;
		}

		const isMatch = await bcrypt.compare(password, admin.password);

		if (!isMatch) {
			res.status(400).json({
				message: 'Invalid Credentials!',
			});
			return;
		}

		const token = jwt.sign(
			{ adminId: admin.id, role: 'admin' },
			JWT_SECRET!
		);

		if (!token) {
			res.status(500).json({
				message: 'Something went wrong!',
			});
			return;
		}

		res.status(200).json({
			message: 'Signed in Successfully!',
			adminId: admin.id,
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
