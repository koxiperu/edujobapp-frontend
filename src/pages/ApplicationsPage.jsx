import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ApplicationsPage = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const data = await api.applications.getAll();
            setApplications(data);
        } catch (error) {
            console.error("Failed to fetch applications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                await api.applications.delete(id);
                setApplications(applications.filter(app => app.id !== id));
            } catch (err) {
                alert('Failed to delete application: ' + err.message);
            }
        }
    };

    // Helper to get status text color
    const getStatusTextColor = (status) => {
        switch (status) {
            case 'ACCEPTED': return 'text-green-600';
            case 'REJECTED': return 'text-red-600';
            case 'UNDER_REVIEW': return 'text-blue-600';
            case 'SUBMITTED': return 'text-yellow-600';
            case 'DRAFT': return 'text-gray-600';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                <Link
                    to="/applications/new"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm transition-colors font-medium"
                >
                    New Application
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-indigo-800">Loading applications...</p>
                </div>
            ) : (
                <div className="bg-white shadow-sm border border-gray-100 overflow-hidden sm:rounded-xl">
                    <ul className="divide-y divide-gray-100">
                        {applications.map((app) => (
                            <li key={app.id}>
                                <div className="px-6 py-5 hover:bg-gray-50 transition duration-150 ease-in-out">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-lg font-bold text-indigo-600 truncate">
                                                {app.title} <span className="text-sm font-normal text-gray-400">({app.applicationType})</span>
                                            </p>
                                            
                                            <div className="mt-2 space-y-1">
                                                <div className="text-sm text-gray-700 font-medium">
                                                    {app.company?.name || 'Unknown Company'}
                                                </div>
                                                
                                                <div className="flex flex-col sm:flex-row sm:space-x-4 text-xs text-gray-500 italic">
                                                    {app.appStatus === 'DRAFT' ? (
                                                        <>
                                                            <span>Created: {new Date(app.creationDate).toLocaleDateString()}</span>
                                                            {app.submitDeadline && (
                                                                <span>• Submission Deadline: {new Date(app.submitDeadline).toLocaleDateString()}</span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Submitted: {app.submitDate ? new Date(app.submitDate).toLocaleDateString() : '-'}</span>
                                                            <span>• Response Deadline: {app.responseDeadline ? new Date(app.responseDeadline).toLocaleDateString() : '-'}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ml-4 flex-shrink-0 flex flex-col items-end space-y-4">
                                            <span className={`text-xs font-bold tracking-wider uppercase ${getStatusTextColor(app.appStatus)}`}>
                                                {app.appStatus}
                                            </span>
                                            
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => navigate(`/applications/${app.id}`)}
                                                    className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-bold hover:bg-indigo-100 transition-colors border border-indigo-100"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/applications/${app.id}/edit`)}
                                                    className="px-3 py-1 bg-gray-50 text-gray-700 rounded-md text-xs font-bold hover:bg-gray-100 transition-colors border border-gray-200"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(app.id)}
                                                    className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-xs font-bold hover:bg-red-100 transition-colors border border-red-100"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                        {applications.length === 0 && (
                            <li className="px-6 py-12 text-center">
                                <div className="text-gray-400 mb-2 text-4xl">📋</div>
                                <p className="text-gray-500 font-medium">No applications found.</p>
                                <p className="text-sm text-gray-400 mt-1">Start by creating your first job or course application.</p>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ApplicationsPage;
