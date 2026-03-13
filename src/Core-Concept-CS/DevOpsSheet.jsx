import { Link, useNavigate } from 'react-router-dom';
import Footer from '../sheet-app/components/Footer';

function DevOpsSheet({ auth, setAuth }) {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setAuth({ isAuthenticated: false, user: null, token: null });
		navigate('/login');
	};

	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white">
			<header className="border-b border-[#1f1f1f] bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-50">
				<div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-5 flex justify-between items-center">
					<div className="flex items-center gap-3">
						<Link to="/sheet" className="text-yellow-400 hover:text-yellow-300 transition-colors">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
							</svg>
						</Link>
						<div>
							<h1 className="text-2xl font-bold leading-tight">
								<span className="text-yellow-400">DevOps</span> Guide
							</h1>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<span className="text-gray-400 text-sm hidden sm:block">{auth.user?.username}</span>
						<button
							onClick={handleLogout}
							className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-sm rounded-lg transition-colors"
						>
							Logout
						</button>
					</div>
				</div>
			</header>

			<div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-8 space-y-8">
				<div className="border border-[#2a2a2a] rounded-2xl overflow-hidden bg-[#0d0d0d]">
					<div className="px-6 py-5 bg-[#111] border-b border-[#1f1f1f] flex items-center justify-between gap-4">
						<div>
							<p className="text-xl font-bold text-yellow-400">🗺️ DevOps Roadmap Module</p>
							<p className="text-xs text-gray-500 mt-0.5">Quick access to your roadmap PDF</p>
						</div>
						<a
							href="https://drive.google.com/file/d/1AhfO_hhII-IVwhiiq1T_UCzp_lQMoDUt/view?usp=sharing"
							target="_blank"
							rel="noopener noreferrer"
							className="px-4 py-2 rounded-lg bg-yellow-400 text-black text-sm font-bold hover:bg-yellow-300 transition-colors"
						>
							Open Roadmap PDF
						</a>
					</div>
				</div>
			</div>

			<div className="pb-10" />
			<Footer />
		</div>
	);
}

export default DevOpsSheet;