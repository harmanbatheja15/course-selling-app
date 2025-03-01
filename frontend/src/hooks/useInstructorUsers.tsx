import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { Instructor, Students } from '../utils/types';

export const useStudents = () => {
	const [students, setStudents] = useState<Students[]>([]);
	const [instructor, setInstructor] = useState<Instructor>();
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
				setInstructor(response.data.instructor);
				setStudents(response.data.instructor.students);
			} catch (err) {
				setError('Failed to fetch students');
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchInstructorStudents();
	}, []);

	return { students, instructor, loading, error };
};

export default useStudents;
