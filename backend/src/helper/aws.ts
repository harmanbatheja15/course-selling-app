import {
	PutObjectCommand,
	UploadPartCommand,
	ListObjectsV2Command,
	PutObjectCommandInput,
	ListObjectsV2CommandInput,
	S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import path from 'path';
import { FolderContents, FolderResult, UploadResult } from './types';

export const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
	},
});

export const createFolder = async (
	instructorId: string,
	courseId: string,
	folderName: string
): Promise<FolderResult> => {
	try {
		const sanitizedFolderName = path
			.normalize(folderName)
			.replace(/^(\.\.(\/|\\|$))+/, '');
		const folderKey = `${instructorId}/${courseId}/${sanitizedFolderName}/`;

		const params: PutObjectCommandInput = {
			Bucket: process.env.AWS_BUCKET_NAME!,
			Key: folderKey,
			Body: '',
		};

		await s3Client.send(new PutObjectCommand(params));

		return {
			success: true,
			folderPath: folderKey,
			message: `Folder ${folderName} created successfully`,
		};
	} catch (error) {
		console.error('Error creating folder:', error);
		throw new Error(
			`Failed to create folder: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		);
	}
};

export const uploadVideo = async (
	instructorId: string,
	courseId: string,
	folderName: string,
	videoFile: Buffer,
	filename: string
): Promise<UploadResult> => {
	try {
		const sanitizedFilename = path
			.normalize(filename)
			.replace(/^(\.\.(\/|\\|$))+/, '');
		const sanitizedFolderName = path
			.normalize(folderName)
			.replace(/^(\.\.(\/|\\|$))+/, '');
		const videoKey = `${instructorId}/${courseId}/${sanitizedFolderName}/${sanitizedFilename}`;

		const upload = new Upload({
			client: s3Client,
			params: {
				Bucket: process.env.AWS_BUCKET_NAME!,
				Key: videoKey,
				Body: videoFile,
				ContentType: 'video/*',
				Metadata: {
					'instructor-id': instructorId,
					'original-filename': filename,
				},
			},
		});

		const result = await upload.done();

		return {
			success: true,
			videoUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${videoKey}`,
			key: videoKey,
			message: 'Video uploaded successfully',
		};
	} catch (error) {
		console.error('Error uploading video:', error);
		throw new Error(
			`Failed to upload video: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		);
	}
};

export const listFolderContents = async (
	instructorId: string,
	courseId: string,
	folderName: string = ''
): Promise<FolderContents> => {
	try {
		const sanitizedFolderName = path
			.normalize(folderName)
			.replace(/^(\.\.(\/|\\|$))+/, '');
		const prefix = `${instructorId}/${courseId}/${sanitizedFolderName}`;

		const params: ListObjectsV2CommandInput = {
			Bucket: process.env.AWS_BUCKET_NAME!,
			Prefix: prefix,
			Delimiter: '/',
		};

		const data = await s3Client.send(new ListObjectsV2Command(params));

		const folders = (data.CommonPrefixes || []).map(
			(prefix) => prefix.Prefix!.split('/').slice(-2)[0]
		);

		const files = (data.Contents || [])
			.map((item) => ({
				name: item.Key!.split('/').pop() || '',
				size: item.Size || 0,
				lastModified: item.LastModified || new Date(),
			}))
			.filter((item) => item.name);

		return {
			folders,
			files,
			path: prefix,
		};
	} catch (error) {
		console.error('Error listing folder contents:', error);
		throw new Error(
			`Failed to list folder contents: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		);
	}
};
