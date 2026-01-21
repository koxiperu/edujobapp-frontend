import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await api.auth.getMe();
                setUser(data);
            } catch (err) {
                console.error("Failed to fetch profile", err);
                setError("Failed to load your profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString; // Return original if invalid
            
            return new Intl.DateTimeFormat('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }).format(date);
        } catch {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                <p className="mt-4 text-purple-800">Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow">
                    <p className="text-red-700">{error}</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="mt-4 text-red-700 font-bold hover:underline"
                    >
                        &larr; Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div id="profile" className="min-h-screen flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex items-center justify-center">
                <div
                    className="w-full rounded-md p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center"
                    style={{
                        backgroundImage: 'url(/backgrounds/profile-bg.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Soft pastel overlay */}
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

                    <div className="relative z-10 w-full max-w-3xl">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-10 text-center md:text-left">
                            <div>
                                <h1 className="text-4xl font-extrabold tracking-tight text-purple-900 drop-shadow-sm">
                                    My Profile
                                </h1>
                                <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 mx-auto md:mx-0"></div>
                            </div>
                            <button
                                onClick={() => navigate('/profile/edit')}
                                className="bg-[#423292] text-white px-4 py-2 rounded-md hover:opacity-90 font-medium transition-colors shadow-sm"
                            >
                                Edit Profile
                            </button>
                        </div>

                        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8">
                            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-purple-100">
                                <div className="relative">
                                    <div className="h-28 w-28 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-5xl shadow-inner border-4 border-white">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="absolute bottom-0 right-0 bg-green-400 h-6 w-6 rounded-full border-4 border-white" title="Active"></div>
                                </div>
                                <div className="text-center md:text-left space-y-2">
                                    <h2 className="text-3xl font-bold text-gray-800">{user.username}</h2>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 uppercase tracking-wider">
                                            {user.role || 'USER'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-purple-800 uppercase tracking-wider opacity-70">First Name</p>
                                    <p className="text-xl font-medium text-gray-900 border-b border-purple-100/50 pb-1">{user.firstName || <span className="text-gray-400 italic">Not set</span>}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-purple-800 uppercase tracking-wider opacity-70">Last Name</p>
                                    <p className="text-xl font-medium text-gray-900 border-b border-purple-100/50 pb-1">{user.lastName || <span className="text-gray-400 italic">Not set</span>}</p>
                                </div>
                                
                                <div className="space-y-1 md:col-span-2">
                                    <p className="text-xs font-bold text-purple-800 uppercase tracking-wider opacity-70">Email Address</p>
                                    <div className="flex items-center">
                                        <span className="text-xl font-medium text-gray-900 border-b border-purple-100/50 pb-1 w-full">{user.email || <span className="text-gray-400 italic">Not set</span>}</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-purple-800 uppercase tracking-wider opacity-70">Phone Number</p>
                                    <p className="text-xl font-medium text-gray-900 border-b border-purple-100/50 pb-1">{user.phone || <span className="text-gray-400 italic">Not set</span>}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-purple-800 uppercase tracking-wider opacity-70">Birthdate</p>
                                    <p className="text-xl font-medium text-gray-900 border-b border-purple-100/50 pb-1">{formatDate(user.birthDate)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;