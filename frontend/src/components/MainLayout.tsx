import React from 'react';
import Navbar from './platform/Navbar';
import Footer from './platform/Footer';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	return (
		<div className='min-h-screen bg-gray-50'>
			<Navbar />
			<main className='max-w-7xl mx-auto py-6 px-4'>{children}</main>
			<Footer />
		</div>
	);
};
