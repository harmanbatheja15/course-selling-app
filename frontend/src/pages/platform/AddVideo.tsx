import { useEffect, useState } from 'react';
import { Upload, Folder } from 'lucide-react';
import { getCourse } from '../../api/courses';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Error, Loading } from '../../components/LoadingError';
import { Course } from '../../utils/types';
import { API_URL } from '../../config';
import axios from 'axios';

const AddVideo = () => {
	const { courseId } = useParams();

	const { isLoading, error, data } = useQuery({
		queryKey: ['courses'],
		queryFn: () => getCourse(courseId!),
	});

	const [course, setCourse] = useState<Course>();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [currentFolder, setCurrentFolder] = useState('');
	const [name, setName] = useState('');
	const [type, setType] = useState('VIDEO');
	const [uploadProgress, setUploadProgress] = useState(0);
	const [message, setMessage] = useState('');

	useEffect(() => {
		if (data?.course) {
			setCourse(data.course);
		}
	}, [data]);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			setMessage('');
		}
	};

	const uploadVideo = async () => {
		if (!selectedFile || !currentFolder) {
			setMessage('Please select a file and folder');
			return;
		}

		setUploading(true);
		setUploadProgress(0);

		const formData = new FormData();
		formData.append('video', selectedFile);
		formData.append('name', name);
		formData.append('type', type);
		formData.append('courseId', courseId!);
		formData.append('folderId', currentFolder);

		try {
			const response = await axios.post(
				`${API_URL}/course/uploadVideo`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${localStorage.getItem(
							'token'
						)}`,
					},
					withCredentials: true,
					onUploadProgress: (progressEvent) => {
						if (progressEvent.total) {
							const progress = Math.round(
								(progressEvent.loaded / progressEvent.total) *
									100
							);
							setUploadProgress(progress);
						}
					},
				}
			);

			if (response.status === 200) {
				setMessage('Upload successful');
				setSelectedFile(null);
				setUploadProgress(100);
			} else {
				setMessage('Error uploading video');
			}
		} catch (error) {
			setMessage('Error uploading video');
		} finally {
			setUploading(false);
		}
	};

	if (isLoading) {
		return <Loading />;
	}

	if (error) {
		return <Error />;
	}

	return (
		<div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
			<div className='mb-6'>
				<h2 className='text-2xl font-semibold mb-4'>
					Upload Course {type === 'VIDEO' ? 'Video' : 'Notes'}
				</h2>

				<div className='mb-4'>
					<div className='flex items-center gap-2 mb-2'>
						<Folder className='w-5 h-5' />
						<span className='font-medium'>Select Folder</span>
					</div>

					<div className='flex items-center gap-2'>
						<select
							value={currentFolder}
							onChange={(e) => setCurrentFolder(e.target.value)}
							className='flex-1 p-2 border rounded'
						>
							<option value=''>Select Folder</option>
							{course?.courseFolders &&
								course?.courseFolders.map((folder) => (
									<option key={folder.id} value={folder.id}>
										{folder.name}
									</option>
								))}
						</select>
					</div>
				</div>

				<div className='flex items-center mb-4 gap-2'>
					<div className='w-full'>
						<div className='flex items-center gap-2 mb-2'>
							<span className='font-medium'>
								{type === 'VIDEO' ? 'Video' : 'Notes'} Title
							</span>
						</div>

						<div className='flex items-center gap-2'>
							<input
								type='text'
								className='flex-1 p-2 border rounded'
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
					</div>
					<div className=''>
						<div className='flex items-center gap-2 mb-2'>
							<span className='font-medium'>Type</span>
						</div>

						<div className='flex items-center gap-2'>
							<select
								className='p-2 border rounded'
								value={type}
								onChange={(e) => setType(e.target.value)}
							>
								<option value='VIDEO'>Video</option>
								<option value='NOTES'>Notes</option>
							</select>
						</div>
					</div>
				</div>

				{/* File Upload */}
				<div className='mb-4'>
					<div className='flex items-center gap-2 mb-2'>
						<Upload className='w-5 h-5' />
						<span className='font-medium'>
							Upload {type === 'VIDEO' ? 'Video' : 'PDF'}
						</span>
					</div>

					<div className='border-2 border-dashed rounded-lg p-6 text-center'>
						{selectedFile ? (
							<div className='space-y-2'>
								<p className='text-sm'>{selectedFile.name}</p>
								<p className='text-xs text-gray-500'>
									{(
										selectedFile.size /
										(1024 * 1024)
									).toFixed(2)}{' '}
									MB
								</p>
								<button
									onClick={() => setSelectedFile(null)}
									className='text-red-500 hover:text-red-600'
								>
									Remove
								</button>
							</div>
						) : (
							<div>
								<input
									type='file'
									onChange={handleFileSelect}
									accept={
										type === 'VIDEO' ? 'video/*' : '.pdf'
									}
									className='hidden'
									id='video-upload'
								/>
								<label
									htmlFor='video-upload'
									className='cursor-pointer text-blue-500 hover:text-blue-600'
								>
									Click to select or drag a video file here
								</label>
							</div>
						)}
					</div>
				</div>

				{/* Upload Progress */}
				{uploading && (
					<div className='mb-4'>
						<div className='h-2 bg-gray-200 rounded'>
							<div
								className='h-full bg-blue-500 rounded transition-all duration-300'
								style={{ width: `${uploadProgress}%` }}
							/>
						</div>
					</div>
				)}

				{/* Status Message */}
				{message && (
					<div
						className={`mb-4 p-3 rounded ${
							message.includes('Error')
								? 'bg-red-100 text-red-700'
								: 'bg-green-100 text-green-700'
						}`}
					>
						{message}
					</div>
				)}

				{/* Upload Button */}
				<button
					onClick={uploadVideo}
					disabled={!selectedFile || !currentFolder || uploading}
					className={`w-full p-3 rounded text-white font-medium ${
						!selectedFile || !currentFolder || uploading
							? 'bg-gray-400 cursor-not-allowed'
							: 'bg-blue-500 hover:bg-blue-600'
					}`}
				>
					{uploading ? 'Uploading...' : 'Upload Video'}
				</button>
			</div>
		</div>
	);
};

export default AddVideo;
