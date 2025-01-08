import { Router } from 'express';
import {
	AllCourses,
	CapturePayment,
	CreateFolder,
	EnrollInCourse,
	GetCourse,
} from '../controllers/course';
import { getPresignedUrl, deleteImageFromS3 } from '../helper/aws';
import studentAuthMiddleware from '../middlewares/studentAuth';
import instructorAuthMiddleware from '../middlewares/instructorAuth';

const router = Router();

router.get('/', AllCourses);

router.get('/:id', GetCourse);

router.post('/createFolder/:courseId', instructorAuthMiddleware, CreateFolder);

router.post('/enroll/:courseId', studentAuthMiddleware, EnrollInCourse);

router.post('/capturePayment', studentAuthMiddleware, CapturePayment);

export default router;
