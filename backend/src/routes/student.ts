import { Router } from 'express';
import studentAuthMiddleware from '../middlewares/studentAuth';
import {
	CheckEnrollment,
	getEnrolledCourse,
	getEnrolledCourses,
	GetProfile,
	Signin,
	Signup,
	UpdateProfile,
} from '../controllers/student';

const router = Router();

// /student/signup
router.post('/signup', Signup);

// /student/signin
router.post('/signin', Signin);

// update profile
router.put('/profile', studentAuthMiddleware, UpdateProfile);

// get profile
router.get('/profile', studentAuthMiddleware, GetProfile);

// All Enrolled Courses
router.get('/courses', studentAuthMiddleware, getEnrolledCourses);

// Single Enrolled Course
router.get('/courses/:courseId', studentAuthMiddleware, getEnrolledCourse);

// Check Enrollment
router.get('/:courseId', studentAuthMiddleware, CheckEnrollment);

export default router;
