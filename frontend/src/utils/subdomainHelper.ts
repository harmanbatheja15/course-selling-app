export const getSubdomain = () => {
	if (process.env.VITE_NODE_ENV === 'development') {
		const host = window.location.hostname;
		if (window.location.hostname === 'localhost') return null;
		const parts = host.split('.');
		return parts[0] || null;
	} else {
		try {
			const parsedUrl = new URL(window.location.href);
			const hostname = parsedUrl.hostname;
			const parts = hostname.split('.');
			return parts.length > 2 ? parts[0] : null;
		} catch (e) {
			console.error('Invalid URL', e);
			return null;
		}
	}
};
