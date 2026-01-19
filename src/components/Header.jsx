import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import logo from '../assets/logo.jpg';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo and Slogan */}
                    <Link to="/" className="flex items-center group">
                        <img
                            src={logo}
                            alt="EduJobApp Logo"
                            className="h-12 w-auto mr-4"
                        />
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-indigo-600 leading-tight">EduJobApp</span>
                            <span className="text-sm text-gray-500 font-medium">Build Your Future Today</span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors">
                                    Dashboard
                                </Link>
                                <Link to="/companies" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors">
                                    Companies
                                </Link>
                                <Link to="/documents" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors">
                                    Documents
                                </Link>
                                <Link to="/applications" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors">
                                    Applications
                                </Link>

                                <div className="flex items-center ml-4 pl-4 border-l border-gray-200 space-x-2">
                                    <span className="text-gray-600 text-sm hidden md:block">
                                        <strong>{user.firstName || user.username}</strong>
                                    </span>
                                    <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 transition-colors" title="Logout">
                                        <FaSignOutAlt className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors">
                                    Jobs Board
                                </Link>
                                <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium transition-colors shadow-sm">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
