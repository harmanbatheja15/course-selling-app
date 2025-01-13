import { Router } from 'express';
import {
	AllCourses,
	CapturePayment,
	CreateFolder,
	EnrollInCourse,
	GetCourse,
	ListFolderContents,
	UploadVideo,
} from '../controllers/course';
import studentAuthMiddleware from '../middlewares/studentAuth';
import instructorAuthMiddleware from '../middlewares/instructorAuth';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.get('/', AllCourses);

router.get('/:id', GetCourse);

router.post('/createFolder/:courseId', instructorAuthMiddleware, CreateFolder);

router.post(
	'/uploadVideo',
	upload.single('video'),
	instructorAuthMiddleware,
	UploadVideo
);

router.get(
	'/videos/:courseId/:folderName',
	instructorAuthMiddleware,
	ListFolderContents
);

router.post('/enroll/:courseId', studentAuthMiddleware, EnrollInCourse);

router.post('/capturePayment', studentAuthMiddleware, CapturePayment);

export default router;
