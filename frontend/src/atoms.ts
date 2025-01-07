import { atom, selector } from 'recoil';

export type UserRole = 'student' | 'instructor' | 'admin';

export interface Instructor {
	id: string;
	name: string;
	email: string;
	organization: string;
	slug: string;
}

export interface AuthResponse {
	message: string;
	instructorId: string;
	token: string;
	instructor: Instructor;
}

export const instructorState = atom<Instructor | null>({
	key: 'instructorState',
	default: null,
});

export const tokenState = atom<string | null>({
	key: 'tokenState',
	default: localStorage.getItem('token'),
});

export const isAuthenticatedSelector = selector<boolean>({
	key: 'isAuthenticated',
	get: ({ get }) => {
		const token = get(tokenState);
		return !!token;
	},
});

export const currentInstructorState = atom<Instructor | null>({
	key: 'currentInstructorState',
	default: null,
});
