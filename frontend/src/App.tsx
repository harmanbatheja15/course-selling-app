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
import ManageCourse from './pages/platform/ManageCourse';
import Profile from './pages/platform/Profile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

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
				<Route
					path='/instructor/dashboard/course/:courseId'
					element={
						<ProtectedRoute>
							<ManageCourse />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/instructor/profile'
					element={
						<ProtectedRoute>
							<Profile />
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
				<QueryClientProvider client={queryClient}>
					<BrowserRouter>
						{subdomain ? <TenantRoutes /> : <MainRoutes />}
					</BrowserRouter>
				</QueryClientProvider>
			</RecoilRoot>
		</>
	);
};

export default App;
