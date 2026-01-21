import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaEdit, FaTrash, FaBuilding, FaFileAlt } from 'react-icons/fa';

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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                <p className="mt-4 text-purple-800">Loading application details...</p>
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
            case 'ACCEPTED': return 'bg-green-100 text-[#166534] border-green-200';
            case 'REJECTED': return 'bg-red-100 text-[#991b1b] border-red-200';
            case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'SUBMITTED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div id="list" className="min-h-screen flex items-center justify-center relative">
            <div className="absolute top-8 left-8 z-20">
                <button 
                    onClick={() => navigate('/applications')}
                    className="text-purple-900 hover:opacity-80 font-bold flex items-center transition-colors text-sm"
                >
                    <span className="mr-2">&larr;</span> Back to Applications
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex items-center justify-center">
                <div
                    className="w-full rounded-md p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center"
                    style={{
                        backgroundImage: 'url(/backgrounds/list-bg.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Soft pastel overlay */}
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

                    <div className="relative z-10 w-full max-w-5xl">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-center mb-10 text-center md:text-left gap-4">
                            <div>
                                <h1 className="text-4xl font-extrabold tracking-tight text-purple-900 drop-shadow-sm">
                                    {application.title}
                                </h1>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(application.appStatus)}`}>
                                        {application.appStatus}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/50 text-gray-600 border border-gray-200">
                                        {application.applicationType} Application
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => navigate(`/applications/${id}/edit`)}
                                    className="bg-[#423292] text-white px-4 py-2 rounded-md hover:opacity-90 font-medium transition-colors shadow-sm flex items-center"
                                >
                                    <FaEdit className="mr-2" /> Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="bg-[#91486c] text-white px-4 py-2 rounded-md font-medium hover:opacity-90 transition-colors shadow-sm flex items-center"
                                >
                                    <FaTrash className="mr-2" /> Delete
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                {/* Main Info */}
                                <div className="bg-white/60 backdrop-blur-md rounded-md shadow-xl border border-white/50 p-8">
                                    <h2 className="text-xl font-bold text-purple-900 mb-6 border-b border-purple-100 pb-2">Details</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-xs font-bold text-purple-800 uppercase tracking-wider opacity-70 mb-1">Description</p>
                                            <p className="text-gray-900 whitespace-pre-wrap">{application.description || <span className="text-gray-400 italic">No description provided.</span>}</p>
                                        </div>
                                        {application.resultNotes && (
                                            <div>
                                                <p className="text-xs font-bold text-purple-800 uppercase tracking-wider opacity-70 mb-1">Result Notes</p>
                                                <p className="text-gray-900 whitespace-pre-wrap">{application.resultNotes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="bg-white/60 backdrop-blur-md rounded-md shadow-xl border border-white/50 p-8">
                                    <h2 className="text-xl font-bold text-purple-900 mb-6 border-b border-purple-100 pb-2">Timeline</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-xs font-bold text-purple-800 uppercase tracking-wider opacity-70 mb-1">Created On</p>
                                            <p className="text-lg font-medium text-gray-900 border-b border-purple-100/50 pb-1">{new Date(application.creationDate).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-purple-800 uppercase tracking-wider opacity-70 mb-1">Submission Date</p>
                                            <p className="text-lg font-medium text-gray-900 border-b border-purple-100/50 pb-1">{application.submitDate ? new Date(application.submitDate).toLocaleDateString() : <span className="text-gray-400 italic">Not submitted yet</span>}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-purple-800 uppercase tracking-wider opacity-70 mb-1">Application Deadline</p>
                                            <p className="text-lg font-medium text-gray-900 border-b border-purple-100/50 pb-1">{application.submitDeadline ? new Date(application.submitDeadline).toLocaleDateString() : <span className="text-gray-400 italic">-</span>}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-purple-800 uppercase tracking-wider opacity-70 mb-1">Response Deadline</p>
                                            <p className="text-lg font-medium text-gray-900 border-b border-purple-100/50 pb-1">{application.responseDeadline ? new Date(application.responseDeadline).toLocaleDateString() : <span className="text-gray-400 italic">-</span>}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Company info */}
                                <div className="bg-white/60 backdrop-blur-md rounded-md shadow-xl border border-white/50 p-8">
                                    <h2 className="text-xl font-bold text-purple-900 mb-6 border-b border-purple-100 pb-2">Company</h2>
                                    {application.company ? (
                                        <div className="flex items-start">
                                            <FaBuilding className="text-[#1a8377] w-8 h-8 mr-3 mt-1" />
                                            <div>
                                                <h3 
                                                    className="text-lg font-bold text-[#1a8377] hover:underline cursor-pointer" 
                                                    onClick={() => navigate(`/companies/${application.company.id}`)}
                                                >
                                                    {application.company.name}
                                                </h3>
                                                <p className="text-sm text-purple-900/70 font-bold">{application.company.type}</p>
                                                <p className="text-sm text-purple-900/60">{application.company.country}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">No company linked.</p>
                                    )}
                                </div>

                                {/* Documents */}
                                <div className="bg-white/60 backdrop-blur-md rounded-md shadow-xl border border-white/50 p-8">
                                    <div className="flex justify-between items-center mb-6 border-b border-purple-100 pb-2">
                                        <h2 className="text-xl font-bold text-purple-900">Documents</h2>
                                        <button
                                            onClick={() => navigate('/documents', { state: { isCreating: true } })}
                                            className="bg-[#423292] text-white px-3 py-1.5 rounded-md text-xs font-bold hover:opacity-90 transition-colors shadow-sm"
                                        >
                                            Upload New
                                        </button>
                                    </div>
                                    {application.documents && application.documents.length > 0 ? (
                                        <ul className="space-y-3">
                                            {application.documents.map(doc => (
                                                <li 
                                                    key={doc.id} 
                                                    className="flex items-center p-3 bg-white/50 border border-purple-100 rounded-md hover:bg-white transition-colors cursor-pointer group" 
                                                    onClick={() => navigate(`/documents/${doc.id}`)}
                                                >
                                                    <FaFileAlt className="w-5 h-5 text-[#423292] mr-3 group-hover:scale-110 transition-transform" />
                                                    <span className="text-sm font-bold text-purple-900 truncate">{doc.fileName}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 italic text-sm text-center py-4 border-2 border-dashed border-purple-100 rounded-md">No documents attached.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailsPage;