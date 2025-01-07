import { Navigate } from 'react-router-dom';
import Features from '../../components/platform/Features';
import Hero from '../../components/platform/Hero';
import { useAuth } from '../../hooks/useAuth';

const Home = () => {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) {
		return <Navigate to='/instructor/dashboard' />;
	}

	return (
		<>
			<div className='lg:px-8 px-4 pt-4'>
				<Hero />
				<Features />
			</div>
		</>
	);
};

export default Home;
