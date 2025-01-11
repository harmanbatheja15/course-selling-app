import { atom, selector } from 'recoil';
import { Instructor } from './utils/types';

export type UserRole = 'student' | 'instructor' | 'admin';

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
