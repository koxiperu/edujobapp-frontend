import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const UsersManagementPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await api.users.getAll();
                // Sort users alphabetically by username
                const sortedData = [...data].sort((a, b) => 
                    a.username.localeCompare(b.username)
                );
                setUsers(sortedData);
            } catch (err) {
                console.error("Failed to fetch users", err);
                setError("You don't have permission to view this page or the server is unreachable.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
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

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.users.delete(id);
                setUsers(users.filter(user => user.id !== id));
            } catch (err) {
                alert('Failed to delete user: ' + err.message);
            }
        }
    };

    const handleEditUser = (id) => {
        navigate(`/users-management/edit/${id}`);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                <p className="mt-4 text-purple-800">Loading users...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl inline-block shadow-md">
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
            <div className="mb-10 space-y-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-purple-900 drop-shadow-sm">User Management</h1>
                    <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2"></div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                    <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-purple-100 shadow-sm flex-1 lg:max-w-2xl">
                        <p className="text-purple-800 text-xs leading-relaxed">
                            <span className="font-bold text-purple-900">Admin Notice:</span> Deleting a user is permanent and will remove all their associated data including applications and documents.
                        </p>
                    </div>
                    <div className="bg-purple-100 px-6 py-3 rounded-full border border-purple-200 shadow-sm whitespace-nowrap ml-auto sm:ml-0">
                        <span className="text-purple-900 font-bold">Total Users: {users.length}</span>
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-purple-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-purple-100">
                        <thead className="bg-purple-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">User</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Phone</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Birthdate</th>
                                <th scope="col" className="relative px-6 py-4">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-transparent divide-y divide-purple-50">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-purple-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold text-lg">
                                                {u.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-purple-900">{u.username}</div>
                                                <div className="text-xs text-purple-500">{u.firstName} {u.lastName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-purple-800 font-medium">{u.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-xs font-bold uppercase tracking-wider ${u.role === 'ADMIN' ? 'text-pink-600' : 'text-purple-600'}`}>
                                            {u.role || 'USER'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">
                                        {u.phone || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">
                                        {formatDate(u.birthDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => handleEditUser(u.id)}
                                            className="text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg transition-all border border-indigo-100 font-bold"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteUser(u.id)}
                                            className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-all border border-red-100 font-bold"
                                            disabled={u.username === 'admin'}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {users.map((u) => (
                    <div key={u.id} className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-purple-100 p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-12 w-12 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold text-xl">
                                    {u.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-3">
                                    <div className="text-lg font-bold text-purple-900">{u.username}</div>
                                    <div className="text-sm text-purple-500">{u.firstName} {u.lastName}</div>
                                </div>
                            </div>
                            <span className={`text-xs font-bold uppercase tracking-wider ${u.role === 'ADMIN' ? 'text-pink-600' : 'text-purple-600'}`}>
                                {u.role || 'USER'}
                            </span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Email:</span>
                                <span className="text-purple-800 font-medium truncate ml-2 max-w-[200px]">{u.email}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Phone:</span>
                                <span className="text-purple-800 font-medium">{u.phone || '-'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Birthdate:</span>
                                <span className="text-purple-800 font-medium">{formatDate(u.birthDate)}</span>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-3 border-t border-purple-50">
                            <button
                                type="button"
                                onClick={() => handleEditUser(u.id)}
                                className="flex-1 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-2 rounded-lg font-bold text-sm transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id)}
                                className="flex-1 text-red-600 bg-red-50 hover:bg-red-100 py-2 rounded-lg font-bold text-sm transition-colors"
                                disabled={u.username === 'admin'}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersManagementPage;