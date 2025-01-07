import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export interface Students {
	title: string;
	description: string;
	price: number;
	thumbnailUrl: string;
	level: string;
	type: string;
	startDate: string;
	endDate: string;
}

export const useStudents = () => {
	const [students, setStudents] = useState<Students[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchInstructorStudents = async () => {
			const token = localStorage.getItem('token');
			setLoading(true);
			setError(null);
			try {
				const response = await axios.get(
					`${API_URL}/instructor/students`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setStudents(response.data.students);
			} catch (err) {
				setError('Failed to fetch students');
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchInstructorStudents();
	}, []);

	return { students, loading, error };
};

export default useStudents;
