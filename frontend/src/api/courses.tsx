import axios from 'axios';
import { API_URL } from '../config';

export const getCourses = async () => {
	try {
		const token = localStorage.getItem('token');

		if (!token) {
			throw new Error('Authentication token not found');
		}

		const response = await axios.get(`${API_URL}/instructor/courses`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching courses', error);
		throw error;
	}
};

export const getCourse = async (courseId: string) => {
	try {
		const token = localStorage.getItem('token');

		if (!token) {
			throw new Error('Authentication token not found');
		}

		const response = await axios.get(
			`${API_URL}/instructor/course/${courseId}`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error fetching course', error);
		throw error;
	}
};

export const getCoursesByInstructor = async () => {
	try {
		const response = await axios.get(`${API_URL}/course`);
		return response.data;
	} catch (error) {
		console.error('Error fetching courses', error);
		throw error;
	}
};

export const getCourseDetail = async (courseId: string) => {
	try {
		const response = await axios.get(`${API_URL}/course/${courseId}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching course detail', error);
		throw error;
	}
};

export const getEnrolledCourses = async () => {
	try {
		const token = localStorage.getItem('token');

		if (!token) {
			throw new Error('Authentication token not found');
		}

		const response = await axios.get(`${API_URL}/student/courses`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching enrolled courses', error);
		throw error;
	}
};
