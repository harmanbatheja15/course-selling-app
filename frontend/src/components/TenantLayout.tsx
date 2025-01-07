import React from 'react';
import Footer from './platform/Footer';
import InstructorNavbar from './instructor/InstructorNavbar';

export const TenantLayout: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	return (
		<div className='min-h-screen bg-gray-50'>
			<InstructorNavbar />
			<main className='max-w-7xl mx-auto py-6 px-4'>{children}</main>
			<Footer />
		</div>
	);
};
