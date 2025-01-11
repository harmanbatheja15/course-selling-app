export interface CourseFolder {
	name: string;
}

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
	courseFolders?: CourseFolder[];
}

export interface Instructor {
	id: string;
	name: string;
	email: string;
	organization: string;
	slug: string;
}

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

export interface AuthResponse {
	message: string;
	instructorId: string;
	token: string;
	instructor: Instructor;
}
