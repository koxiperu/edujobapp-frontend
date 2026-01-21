import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        role: 'USER',
        phone: '',
        birthDate: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await api.auth.getMe();
                setUser({
                    username: data.username || '',
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    role: data.role || 'USER',
                    phone: data.phone || '',
                    birthDate: data.birthDate ? data.birthDate.split('T')[0] : ''
                });
            } catch (err) {
                console.error("Failed to fetch profile", err);
                setError("Failed to load your profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.users.updateMe(user);
            const storedUser = JSON.parse(sessionStorage.getItem('edujobapp_user') || '{}');
            sessionStorage.setItem('edujobapp_user', JSON.stringify({ ...storedUser, ...user }));
            navigate('/profile');
        } catch (err) {
            alert('Failed to update profile: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div id="form" className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mx-auto"></div>
                    <p className="mt-4 text-purple-900 font-bold">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div id="form" className="min-h-screen flex items-center justify-center relative">
            {/* Absolute Back Button */}
            <div className="absolute top-8 left-8 z-20">
                <button 
                    onClick={() => navigate('/profile')}
                    className="text-purple-900 hover:opacity-80 font-bold flex items-center transition-colors text-sm"
                >
                    <span className="mr-2">&larr;</span> Back to Profile
                </button>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex items-center justify-center">
                <div
                    className="w-full rounded-md p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center"
                    style={{
                        backgroundImage: 'url(/backgrounds/form-bg.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Soft pastel overlay */}
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

                    <div className="relative z-10 w-full max-w-md">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-extrabold tracking-tight text-purple-900 drop-shadow-sm">
                                Edit Profile
                            </h1>
                            <div className="w-20 h-1 bg-gradient-to-r from-purple-900 to-pink-400 mx-auto rounded-full mt-2"></div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-700 border-l-4 border-red-500 rounded-md shadow-sm">
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-bold text-purple-900 mb-1 ml-1">Username</label>
                                        <input
                                            type="text"
                                            id="username"
                                            value={user.username}
                                            readOnly
                                            className="block w-full px-4 py-3 rounded-md border-2 border-gray-200 bg-gray-100/50 text-gray-500 cursor-not-allowed outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="role" className="block text-sm font-bold text-purple-900 mb-1 ml-1">Role</label>
                                        <input
                                            type="text"
                                            id="role"
                                            value={user.role}
                                            readOnly
                                            className="block w-full px-4 py-3 rounded-md border-2 border-gray-200 bg-gray-100/50 text-gray-500 cursor-not-allowed outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-bold text-purple-900 mb-1 ml-1">First Name</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            value={user.firstName}
                                            onChange={(e) => setUser({...user, firstName: e.target.value})}
                                            className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-bold text-purple-900 mb-1 ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            value={user.lastName}
                                            onChange={(e) => setUser({...user, lastName: e.target.value})}
                                            className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-purple-900 mb-1 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={user.email}
                                        onChange={(e) => setUser({...user, email: e.target.value})}
                                        className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-bold text-purple-900 mb-1 ml-1">Phone Number</label>
                                        <input
                                            type="text"
                                            id="phone"
                                            value={user.phone}
                                            onChange={(e) => setUser({...user, phone: e.target.value})}
                                            className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="birthDate" className="block text-sm font-bold text-purple-900 mb-1 ml-1">Birthdate</label>
                                        <input
                                            type="date"
                                            id="birthDate"
                                            value={user.birthDate}
                                            onChange={(e) => setUser({...user, birthDate: e.target.value})}
                                            className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-[#423292] text-white px-8 py-4 rounded-md font-bold text-lg shadow-xl hover:opacity-90 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Update Profile'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/profile')}
                                    className="w-full bg-white/50 text-purple-900 px-8 py-3 rounded-md font-bold border-2 border-[#f5c6cf] hover:bg-[#f5c6cf]/20 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;