import { Request, Response } from 'express';

export const extractSubdomain = (req: Request) => {
	const referer = req.get('Referer');

	const hostname = new URL(referer!).hostname;
	const subdomain = hostname?.includes('.') ? hostname.split('.')[0] : null;

	if (!subdomain) {
		return null;
	}

	return subdomain;
};
