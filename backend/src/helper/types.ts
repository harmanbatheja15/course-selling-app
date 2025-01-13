export interface UploadResult {
	success: boolean;
	videoUrl: string;
	key: string;
	message: string;
}

export interface FolderResult {
	success: boolean;
	folderPath: string;
	message: string;
}

export interface FolderContents {
	folders: string[];
	files: {
		name: string;
		size: number;
		lastModified: Date;
	}[];
	path: string;
}
