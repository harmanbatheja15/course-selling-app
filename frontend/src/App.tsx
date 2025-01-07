import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/platform/Home';
import Signup from './pages/platform/Signup';
import Signin from './pages/platform/Signin';
// import Navbar from './components/platform/Navbar';
// import Footer from './components/platform/Footer';
import { RecoilRoot } from 'recoil';
import { ProtectedRoute } from './components/ProtectedRoute';
import Dashboard from './pages/instructor/Dashboard';
import StudentSignup from './pages/instructor/StudentSignup';
import InstructorHome from './pages/instructor/InstructorHome';
import StudentSignin from './pages/instructor/StudentSignin';
import { getSubdomain } from './utils/subdomainHelper';
import { TenantLayout } from './components/TenantLayout';
import { MainLayout } from './components/MainLayout';
import CourseDetail from './components/instructor/CourseDetail';
import EnrolledCourses from './components/instructor/EnrolledCourses';

const MainRoutes = () => {
	return (
		<MainLayout>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/instructor/signup' element={<Signup />} />
				<Route path='/instructor/signin' element={<Signin />} />
				<Route
					path='/instructor/dashboard'
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</MainLayout>
	);
};

const TenantRoutes = () => {
	return (
		<TenantLayout>
			<Routes>
				<Route path='/' element={<InstructorHome />} />
				<Route path='/signup' element={<StudentSignup />} />
				<Route path='/signin' element={<StudentSignin />} />
				<Route path='/course/:courseId' element={<CourseDetail />} />
				<Route
					path='/enrolled-courses'
					element={
						<ProtectedRoute>
							<EnrolledCourses />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</TenantLayout>
	);
};

const App = () => {
	const subdomain = getSubdomain();
	console.log(subdomain);

	return (
		<>
			<RecoilRoot>
				<BrowserRouter>
					{subdomain ? <TenantRoutes /> : <MainRoutes />}
				</BrowserRouter>
			</RecoilRoot>
		</>
	);
};

export default App;
