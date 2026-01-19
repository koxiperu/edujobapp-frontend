import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditUserPage = () => {
    const { id } = useParams();
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
        const fetchUser = async () => {
            try {
                const data = await api.users.getById(id);
                // Ensure null values are handled for inputs
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
                console.error("Failed to fetch user", err);
                setError("Failed to load user details. You might not have permission.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.users.update(id, user);
            navigate('/users-management');
        } catch (err) {
            alert('Failed to update user: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                <p className="mt-4 text-purple-800">Loading user data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow">
                    <p className="text-red-700">{error}</p>
                    <button 
                        onClick={() => navigate('/users-management')}
                        className="mt-4 text-red-700 font-bold hover:underline"
                    >
                        &larr; Back to Users Management
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="mb-8">
                <button 
                    onClick={() => navigate('/users-management')}
                    className="text-purple-600 hover:text-purple-800 font-medium flex items-center transition-colors"
                >
                    <span className="mr-2">&larr;</span> Back to Management
                </button>
                <h1 className="text-3xl font-extrabold text-purple-900 mt-4">Edit User</h1>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2"></div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-purple-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username Field (Read-only or Editable) */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-semibold text-purple-900 mb-2">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={user.username}
                            readOnly
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 focus:outline-none cursor-not-allowed"
                            title="Username cannot be changed"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-semibold text-purple-900 mb-2">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                value={user.firstName}
                                onChange={(e) => setUser({...user, firstName: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-purple-50/30"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-semibold text-purple-900 mb-2">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                value={user.lastName}
                                onChange={(e) => setUser({...user, lastName: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-purple-50/30"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-purple-900 mb-2">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={user.email}
                            onChange={(e) => setUser({...user, email: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-purple-50/30"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-purple-900 mb-2">Phone Number</label>
                            <input
                                type="text"
                                id="phone"
                                value={user.phone}
                                onChange={(e) => setUser({...user, phone: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-purple-50/30"
                            />
                        </div>
                        <div>
                            <label htmlFor="birthDate" className="block text-sm font-semibold text-purple-900 mb-2">Birthdate</label>
                            <input
                                type="date"
                                id="birthDate"
                                value={user.birthDate}
                                onChange={(e) => setUser({...user, birthDate: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-purple-50/30"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-semibold text-purple-900 mb-2">User Role</label>
                        <select
                            id="role"
                            value={user.role}
                            onChange={(e) => setUser({...user, role: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-purple-50/30"
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving Changes...' : 'Save'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/users-management')}
                            className="px-6 py-3 rounded-xl border border-purple-200 text-purple-600 font-bold hover:bg-purple-50 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserPage;