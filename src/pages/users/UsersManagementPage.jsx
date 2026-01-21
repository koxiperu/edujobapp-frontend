import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FaExclamationTriangle, FaEdit, FaTrash } from 'react-icons/fa';

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

    return (
        <div id="admin" className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div
                className="rounded-md p-6 md:p-10 shadow-2xl relative overflow-hidden"
                style={{
                    backgroundImage: 'url(/backgrounds/form-bg.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Soft pastel overlay - matching other pages */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

                <div className="relative z-10">
                    <div className="mb-10 space-y-6 text-center"
                    >
                        <div>
                            <h1 className="text-4xl font-extrabold text-purple-900 drop-shadow-sm">User Management</h1>
                            <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 mx-auto"></div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                            <div className="whitespace-nowrap ml-2">
                                <span className="text-purple-900 font-bold text-lg">Total Users: {users.length}</span>
                            </div>
                            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-md border border-purple-100 shadow-sm flex-1 lg:max-w-2xl flex items-center gap-3">
                                <FaExclamationTriangle className="text-amber-500 flex-shrink-0" />
                                <p className="text-purple-800 text-xs leading-relaxed text-left">
                                    Deleting a user is permanent and will remove all their associated data including applications and documents.
                                </p>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                            <p className="mt-4 text-purple-800 font-bold">Loading users...</p>
                        </div>
                    ) : error ? (
                        <div className="py-20 text-center">
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md inline-block shadow-md">
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block bg-white/80 backdrop-blur-sm shadow-xl rounded-none overflow-hidden border border-[#90636b]">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-[#90636b]">
                                        <thead className="bg-[#90636b]/30">
                                            <tr>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#90636b] uppercase tracking-wider">User</th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#90636b] uppercase tracking-wider">Email</th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#90636b] uppercase tracking-wider">Role</th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#90636b] uppercase tracking-wider">Phone</th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#90636b] uppercase tracking-wider">Birthdate</th>
                                                <th scope="col" className="relative px-6 py-4">
                                                    <span className="sr-only">Actions</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-transparent divide-y divide-[#90636b]">
                                            {users.map((u) => (
                                                <tr key={u.id} className="hover:bg-[#f5c6cf]/10 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-[#7ea7a2] rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                                {u.username.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-bold text-[#1a8377]">{u.username}</div>
                                                                <div className="text-xs text-[#90636b]/70">{u.firstName} {u.lastName}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-purple-900 font-medium">{u.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`text-xs font-bold uppercase tracking-wider ${u.role === 'ADMIN' ? 'text-[#991b1b]' : 'text-[#854d0e]'}`}>
                                                            {u.role || 'USER'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-medium">
                                                        {u.phone || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-medium">
                                                        {formatDate(u.birthDate)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleEditUser(u.id)}
                                                                className="bg-[#646cff] text-white p-2 rounded-sm hover:opacity-90 transition-colors shadow-sm flex items-center justify-center"
                                                                title="Edit"
                                                            >
                                                                <FaEdit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteUser(u.id)}
                                                                className="bg-[#6b21a8] text-white p-2 rounded-sm hover:opacity-90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                                                disabled={u.username === 'admin'}
                                                                title="Delete"
                                                            >
                                                                <FaTrash className="w-4 h-4" />
                                                            </button>
                                                        </div>
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
                                    <div key={u.id} className="bg-white/80 backdrop-blur-sm shadow-lg rounded-none border border-[#90636b] p-5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-[#7ea7a2] rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                    {u.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-lg font-bold text-[#1a8377]">{u.username}</div>
                                                    <div className="text-sm text-[#90636b]/70">{u.firstName} {u.lastName}</div>
                                                </div>
                                            </div>
                                            <span className={`text-xs font-bold uppercase tracking-wider ${u.role === 'ADMIN' ? 'text-[#991b1b]' : 'text-[#854d0e]'}`}>
                                                {u.role || 'USER'}
                                            </span>
                                        </div>
                                        
                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[#90636b]/60">Email:</span>
                                                <span className="text-purple-900 font-medium truncate ml-2 max-w-[200px]">{u.email}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[#90636b]/60">Phone:</span>
                                                <span className="text-purple-900 font-medium">{u.phone || '-'}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[#90636b]/60">Birthdate:</span>
                                                <span className="text-purple-900 font-medium">{formatDate(u.birthDate)}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-3 pt-3 border-t border-[#f5c6cf]">
                                            <button
                                                type="button"
                                                onClick={() => handleEditUser(u.id)}
                                                className="bg-[#646cff] text-white p-2 rounded-sm hover:opacity-90 transition-colors shadow-sm flex items-center justify-center"
                                                title="Edit"
                                            >
                                                <FaEdit className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteUser(u.id)}
                                                className="bg-[#6b21a8] text-white p-2 rounded-sm hover:opacity-90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                                disabled={u.username === 'admin'}
                                                title="Delete"
                                            >
                                                <FaTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
    );
};

export default UsersManagementPage;
