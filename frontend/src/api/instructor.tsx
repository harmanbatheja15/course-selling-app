import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { Instructor } from '../utils/types';

export const getInstructor = () => {
	const [instructor, setInstructor] = useState<Instructor>();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchInstructor = async () => {
		// const token = localStorage.getItem('token');
		setLoading(true);
		setError(null);
		try {
			const response = await axios.get(
				`${API_URL}/instructor`
				// {
				// 	headers: {
				// 		Authorization: `Bearer ${token}`,
				// 	},
				// }
			);
			setInstructor(response.data.instructor);
		} catch (err) {
			setError('Failed to fetch instructor');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchInstructor();
	}, []);

	return { instructor, loading, error, fetchInstructor };
};

export default getInstructor;
