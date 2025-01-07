import { Router } from 'express';
import { Signin, Signup } from '../controllers/admin';

const router = Router();

// Signup
router.post('/signup', Signup);

// Signin
router.post('/signin', Signin);

export default router;
