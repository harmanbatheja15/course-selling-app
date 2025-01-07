require('dotenv').config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import studentRouter from './routes/student';
import adminRouter from './routes/admin';
import instructorRouter from './routes/instructor';
import courseRouter from './routes/course';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(
	cors({
		origin: '*',
		credentials: true,
	})
);

app.use('/student', studentRouter);
app.use('/admin', adminRouter);
app.use('/instructor', instructorRouter);
app.use('/course', courseRouter);

app.get('/', (req: Request, res: Response) => {
	res.send('Server is up and running!!');
});

app.post('/logout', (req, res) => {
	res.status(200).json({ message: 'Logged out successfully' });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
