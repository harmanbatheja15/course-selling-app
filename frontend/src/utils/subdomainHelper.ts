export const getSubdomain = () => {
	const host = window.location.hostname;
	if (window.location.hostname === 'localhost') return null;
	const parts = host.split('.');
	return parts[0] || null;
};
