import { useState, useEffect } from 'react';
import api from '../services/api';

const UsersManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await api.users.getAll();
                setUsers(data);
            } catch (err) {
                console.error("Failed to fetch users", err);
                setError("You don't have permission to view this page or the server is unreachable.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-purple-900 drop-shadow-sm">User Management</h1>
                    <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2"></div>
                </div>
                <div className="bg-purple-100 px-4 py-2 rounded-full border border-purple-200">
                    <span className="text-purple-900 font-bold">Total Users: {users.length}</span>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-purple-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-purple-100">
                        <thead className="bg-purple-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">User</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Joined</th>
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
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${u.role === 'ADMIN' ? 'bg-pink-100 text-pink-800 border border-pink-200' : 'bg-purple-100 text-purple-800 border border-purple-200'}`}>
                                            {u.role || 'USER'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">
                                        {u.id < 3 ? 'System Seed' : 'New User'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
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

            <div className="mt-8 bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-purple-100 shadow-lg">
                <h3 className="text-lg font-bold text-purple-900 mb-2">Admin Notice</h3>
                <p className="text-purple-800 text-sm">
                    As an administrator, you are responsible for maintaining the system's users.
                    Deleting a user is permanent and will remove all their associated data including applications and documents.
                </p>
            </div>
        </div>
    );
};

export default UsersManagementPage;
