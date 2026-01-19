import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.jpg';

const Header = () => {
    const { user, logout, isAdmin } = useAuth(); // Assuming useAuth exposes isAdmin, if not check user.role.name
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Helper to check admin status if hook doesn't provide it directly
    const isUserAdmin = isAdmin || user?.role === 'ADMIN';

    return (
        <header className="bg-white shadow relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo and Slogan */}
                    <Link to="/" className="flex items-center group" onClick={closeMenu}>
                        <img
                            src={logo}
                            alt="EduJobApp Logo"
                            className="h-12 w-auto mr-4"
                        />
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-violet-600 leading-tight">EduJob App Tracker</span>
                            <span className="text-sm text-gray-500 font-medium">Manage your future</span>
                        </div>
                    </Link>

                    {/* Right Side Content */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                {/* Profile Info & Logout (Visible on Bar) */}
                                <div className="flex items-center space-x-3 mr-2">
                                    <div className="flex items-center text-gray-700">
                                        <FaUserCircle className="w-6 h-6 mr-2 text-indigo-600" />
                                        <span className="font-medium hidden sm:block">{user.firstName || user.username}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                        title="Logout"
                                    >
                                        <FaSignOutAlt className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Menu Toggle Button */}
                                <button
                                    onClick={toggleMenu}
                                    className="text-gray-700 hover:text-indigo-600 focus:outline-none p-2 rounded-md hover:bg-gray-100"
                                >
                                    {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                                </button>
                            </>
                        ) : (
                            /* Unauthorized: Only Login & Register */
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-700 hover:text-violet-600 font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-violet-500 text-white px-4 py-2 rounded-md hover:bg-violet-600 font-medium transition-colors shadow-sm">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Side Menu (Right Column) */}
            {isMenuOpen && user && (
                <div className="absolute top-20 right-0 w-64 bg-white shadow-lg border-t border-gray-100 flex flex-col h-[calc(100vh-5rem)] overflow-y-auto">
                    <nav className="flex flex-col p-4 space-y-2">
                        <Link
                            to="/dashboard"
                            className="px-4 py-3 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium"
                            onClick={closeMenu}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/applications"
                            className="px-4 py-3 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium"
                            onClick={closeMenu}
                        >
                            Applications
                        </Link>
                        <Link
                            to="/documents"
                            className="px-4 py-3 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium"
                            onClick={closeMenu}
                        >
                            Documents
                        </Link>
                        <Link
                            to="/companies"
                            className="px-4 py-3 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium"
                            onClick={closeMenu}
                        >
                            Companies
                        </Link>
                        <Link
                            to="/profile"
                            className="px-4 py-3 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium"
                            onClick={closeMenu}
                        >
                            Profile
                        </Link>

                        {/* Admin Section */}
                        {isUserAdmin && (
                            <>
                                <div className="border-t border-gray-200 my-2 pt-2">
                                    <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Admin
                                    </span>
                                </div>
                                <Link
                                    to="/users-management"
                                    className="px-4 py-3 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium"
                                    onClick={closeMenu}
                                >
                                    Manage Users
                                </Link>
                                {/* Disabled Links */}
                                <div className="px-4 py-3 rounded-md text-gray-400 cursor-not-allowed font-medium flex justify-between items-center group">
                                    <span>Manage Companies</span>
                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">TODO</span>
                                </div>
                                <div className="px-4 py-3 rounded-md text-gray-400 cursor-not-allowed font-medium flex justify-between items-center group">
                                    <span>Change Password</span>
                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">TODO</span>
                                </div>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
