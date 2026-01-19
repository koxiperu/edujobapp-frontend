import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-purple-900 mt-4">My Profile</h1>
                    <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2"></div>
                </div>
                <button
                    onClick={() => navigate('/profile/edit')}
                    className="bg-purple-600 text-white font-bold py-2 px-6 rounded-xl hover:bg-purple-700 hover:shadow-lg transition-all"
                >
                    Edit Profile
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-purple-100 p-8">
                <div className="space-y-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="h-20 w-20 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-3xl">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {user.role || 'USER'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-purple-50 pt-6">
                        <div>
                            <p className="text-sm font-medium text-gray-500">First Name</p>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{user.firstName || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Last Name</p>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{user.lastName || '-'}</p>
                        </div>
                    </div>

                    <div className="border-t border-purple-50 pt-6">
                        <p className="text-sm font-medium text-gray-500">Email Address</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{user.email || '-'}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-purple-50 pt-6">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Phone Number</p>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{user.phone || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Birthdate</p>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{formatDate(user.birthDate)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;