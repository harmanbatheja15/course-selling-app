import { Router } from 'express';
import instructorAuthMiddleware from '../middlewares/instructorAuth';
import {
	AddCourse,
	DeleteCourse,
	GetCourse,
	GetCourses,
	Signin,
	Signup,
	UpdateCourse,
	getInstructor,
	getInstructorStudents,
} from '../controllers/instructor';

const router = Router();

function generateSlug(organization: string): string {
	return organization
		.toLowerCase()
		.trim()
		.replace(/[\s]+/g, '-') // Replace spaces with hyphens
		.replace(/[^a-z0-9-]/g, ''); // Remove non-alphanumeric characters
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	throw new Error('JWT_SECRET is not defined in environment variables.');
}

// /instructor/signup
router.post('/signup', Signup);

// /instructor/signin
router.post('/signin', Signin);

// /instructor
router.get('/', instructorAuthMiddleware, getInstructor);

// /instructor/students
router.get('/students', instructorAuthMiddleware, getInstructorStudents);

// Add Course
router.post('/course', instructorAuthMiddleware, AddCourse);

// Update Course
router.put('/course/:id', instructorAuthMiddleware, UpdateCourse);

// Get Courses
router.get('/courses', instructorAuthMiddleware, GetCourses);

// Get Course
router.get('/course/:id', instructorAuthMiddleware, GetCourse);

// Delete Course
router.delete('/course/:id', instructorAuthMiddleware, DeleteCourse);

export default router;
