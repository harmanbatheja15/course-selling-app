import axios from 'axios';
import { API_URL } from '../config';

export const getInstructorProfile = async () => {
	try {
		const token = localStorage.getItem('token');

		if (!token) {
			throw new Error('Authentication token not found');
		}

		const response = await axios.get(`${API_URL}/instructor/students`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data.instructor;
	} catch (error) {
		console.error('Error fetching data', error);
		throw error;
	}
};
