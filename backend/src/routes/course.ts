import { Router } from 'express';
import {
	AllCourses,
	CapturePayment,
	EnrollInCourse,
	GetCourse,
} from '../controllers/course';
import studentAuthMiddleware from '../middlewares/studentAuth';

const router = Router();

router.get('/', AllCourses);

router.get('/:id', GetCourse);

router.post('/enroll/:courseId', studentAuthMiddleware, EnrollInCourse);

router.post('/capturePayment', studentAuthMiddleware, CapturePayment);

export default router;
