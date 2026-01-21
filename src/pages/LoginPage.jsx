import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(credentials);
            if (user?.role === 'ADMIN') {
                navigate('/users-management');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Invalid username or password',err);
        }
    };

    return (
        <div id="form" className="min-h-screen flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex items-center justify-center">
            <div
                className="w-full rounded-md p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center"
                style={{
                    backgroundImage: 'url(/backgrounds/form-bg.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Soft pastel overlay - matching homepage */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

                <div className="relative z-10 w-full max-w-md">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold tracking-tight text-purple-900 drop-shadow-sm mb-2">
                            Welcome Back
                        </h1>
                        <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
                        <p className="mt-4 text-purple-800 font-medium">Log in to track your path to success</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-bold text-purple-900 mb-1 ml-1">Username</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-[#90636b] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="your_username"
                                    value={credentials.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-bold text-purple-900 mb-1 ml-1">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-[#90636b] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    value={credentials.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <span className="text-red-500">⚠️</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700 font-medium">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full bg-[#423292] text-white px-8 py-4 rounded-md font-bold text-lg shadow-xl hover:opacity-90 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Sign In
                            </button>
                        </div>

                        <div className="text-center pt-4">
                            <Link to="/register" className="text-sm font-bold text-purple-700 hover:text-purple-900 hover:underline transition-colors">
                                Don't have an account? Create one for free
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    );
};

export default LoginPage;
