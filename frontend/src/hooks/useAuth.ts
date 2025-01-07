import { useRecoilState, useRecoilValue } from 'recoil';
import axios from 'axios';
import {
	instructorState,
	tokenState,
	isAuthenticatedSelector,
	AuthResponse,
} from '../atoms';
import { API_URL } from '../config';

const api = axios.create({
	baseURL: `${API_URL}`,
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export const useAuth = () => {
	const [instructor, setInstructor] = useRecoilState(instructorState);
	const [token, setToken] = useRecoilState(tokenState);
	const isAuthenticated = useRecoilValue(isAuthenticatedSelector);

	const signin = async (email: string, password: string) => {
		try {
			const { data } = await api.post<AuthResponse>(
				'/instructor/signin',
				{
					email,
					password,
				}
			);
			localStorage.setItem('token', data.token);
			setToken(data.token);
			setInstructor(data.instructor);
			return data;
		} catch (error) {
			console.error('Signin error:', error);
			throw error;
		}
	};

	const signup = async (signupData: {
		name: string;
		email: string;
		password: string;
		organization: string;
	}) => {
		try {
			const { data } = await api.post<AuthResponse>(
				'/instructor/signup',
				signupData
			);
			localStorage.setItem('token', data.token);
			setToken(data.token);
			setInstructor(data.instructor);
			return data;
		} catch (error) {
			console.error('Signup error:', error);
			throw error;
		}
	};

	const logout = async () => {
		try {
			await api.post('/logout');
			localStorage.removeItem('token');
			setToken(null);
			setInstructor(null);
		} catch (error) {
			console.error('Logout error:', error);
			throw error;
		}
	};

	return {
		instructor,
		isAuthenticated,
		token,
		signin,
		signup,
		logout,
	};
};
