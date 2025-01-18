import axios from 'axios';
import { API_URL } from '../config';

export const StudentSignup = async (
	name: string,
	email: string,
	password: string
): Promise<void> => {
	try {
		await axios.post(`${API_URL}/student/signup`, {
			name,
			email,
			password,
		});
	} catch (error) {
		console.error('Error signing up', error);
		throw error;
	}
};

export const StudentSignin = async (
	email: string,
	password: string
): Promise<string> => {
	try {
		const response = await axios.post(`${API_URL}/student/signin`, {
			email,
			password,
		});
		return response.data.token;
	} catch (error) {
		console.error('Error signing in', error);
		throw error;
	}
};
