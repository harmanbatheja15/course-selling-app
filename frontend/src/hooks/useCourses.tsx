import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export interface Course {
	id: string;
	title: string;
	description: string;
	price: number;
	thumbnailUrl: string;
	level: string;
	type: string;
	startDate: string;
	endDate: string;
}

export const useCourses = () => {
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchCourses = async () => {
		const token = localStorage.getItem('token');
		setLoading(true);
		setError(null);
		try {
			const response = await axios.get(`${API_URL}/instructor/courses`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setCourses(response.data.courses);
		} catch (err) {
			setError('Failed to fetch courses');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCourses();
	}, []);

	return { courses, loading, error, fetchCourses };
};

export default useCourses;
