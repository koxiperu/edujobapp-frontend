import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ApplicationDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const data = await api.applications.getById(id);
                setApplication(data);
            } catch (err) {
                console.error("Failed to fetch application details", err);
                setError("Failed to load application details.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                await api.applications.delete(id);
                navigate('/applications');
            } catch (err) {
                alert('Failed to delete application: ' + err.message);
            }
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-indigo-800">Loading application details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow">
                    <p className="text-red-700">{error}</p>
                    <button 
                        onClick={() => navigate('/applications')}
                        className="mt-4 text-red-700 font-bold hover:underline"
                    >
                        &larr; Back to Applications
                    </button>
                </div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACCEPTED': return 'bg-green-100 text-green-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800';
            case 'SUBMITTED': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <button 
                        onClick={() => navigate('/applications')}
                        className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors mb-2"
                    >
                        <span className="mr-2">&larr;</span> Back to Applications
                    </button>
                    <h1 className="text-3xl font-extrabold text-gray-900">{application.title}</h1>
                    <div className="flex items-center space-x-3 mt-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.appStatus)}`}>
                            {application.appStatus}
                        </span>
                        <span className="text-gray-500">{application.applicationType} Application</span>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => navigate(`/applications/${id}/edit`)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors border border-red-200"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Main Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Details</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Description</p>
                                <p className="text-gray-900 whitespace-pre-wrap">{application.description || 'No description provided.'}</p>
                            </div>
                            {application.resultNotes && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Result Notes</p>
                                    <p className="text-gray-900 whitespace-pre-wrap">{application.resultNotes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Created On</p>
                                <p className="text-gray-900">{new Date(application.creationDate).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Submission Date</p>
                                <p className="text-gray-900">{application.submitDate ? new Date(application.submitDate).toLocaleDateString() : 'Not submitted yet'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Application Deadline</p>
                                <p className="text-gray-900">{application.submitDeadline ? new Date(application.submitDeadline).toLocaleDateString() : '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Response Deadline</p>
                                <p className="text-gray-900">{application.responseDeadline ? new Date(application.responseDeadline).toLocaleDateString() : '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Company info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Company</h2>
                        {application.company ? (
                            <div>
                                <h3 className="font-bold text-indigo-600 hover:underline cursor-pointer" onClick={() => navigate(`/companies/${application.company.id}`)}>
                                    {application.company.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">{application.company.type}</p>
                                <p className="text-sm text-gray-500">{application.company.country}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No company linked.</p>
                        )}
                    </div>

                    {/* Documents */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Documents</h2>
                            <button
                                onClick={() => navigate('/documents', { state: { isCreating: true } })}
                                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                                Upload New
                            </button>
                        </div>
                        {application.documents && application.documents.length > 0 ? (
                            <ul className="space-y-3">
                                {application.documents.map(doc => (
                                    <li key={doc.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer" onClick={() => navigate(`/documents/${doc.id}`)}>
                                        <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                        <span className="text-sm font-medium text-gray-700 truncate">{doc.fileName}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic text-sm">No documents attached.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailsPage;
