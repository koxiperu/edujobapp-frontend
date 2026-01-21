import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaEye, FaEdit, FaTrash, FaBriefcase, FaGraduationCap, FaCalendarAlt, FaFilter, FaSort, FaTimes } from 'react-icons/fa';

const ApplicationsPage = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filter and Sort States
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterType, setFilterType] = useState('ALL');
    const [sortBy, setSortBy] = useState('DATE_NEWEST');

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

    const clearFilters = () => {
        setFilterStatus('ALL');
        setFilterType('ALL');
    };

    const isFiltered = filterStatus !== 'ALL' || filterType !== 'ALL';

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'ACCEPTED': return 'bg-green-100 text-green-800 border-green-200';
            case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
            case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'SUBMITTED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    // Filter and Sort Logic
    const processedApplications = applications
        .filter(app => {
            if (filterStatus !== 'ALL' && app.appStatus !== filterStatus) return false;
            if (filterType !== 'ALL' && app.applicationType !== filterType) return false;
            return true;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'DATE_NEWEST':
                    return new Date(b.creationDate) - new Date(a.creationDate);
                case 'DATE_OLDEST':
                    return new Date(a.creationDate) - new Date(b.creationDate);
                case 'COMPANY_ASC':
                    return (a.company?.name || '').localeCompare(b.company?.name || '');
                case 'COMPANY_DESC':
                    return (b.company?.name || '').localeCompare(a.company?.name || '');
                case 'TITLE_ASC':
                    return a.title.localeCompare(b.title);
                case 'TITLE_DESC':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });

    const jobApplications = processedApplications.filter(app => app.applicationType === 'JOB');
    const eduApplications = processedApplications.filter(app => app.applicationType !== 'JOB');

    const ApplicationCard = ({ app }) => (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-md shadow-md hover:shadow-lg transition duration-200 flex flex-col justify-between border border-[#f5c6cf] relative mb-6">
            {/* Top Right Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
                <button
                    onClick={() => navigate(`/applications/${app.id}`)}
                    className="bg-[#646cff] text-white p-2 rounded-sm hover:opacity-90 transition-colors shadow-sm flex items-center justify-center"
                    title="View"
                >
                    <FaEye className="w-3 h-3" />
                </button>
                <button
                    onClick={() => navigate(`/applications/${app.id}/edit`)}
                    className="bg-[#423292] text-white p-2 rounded-sm hover:opacity-90 transition-colors shadow-sm flex items-center justify-center"
                    title="Edit"
                >
                    <FaEdit className="w-3 h-3" />
                </button>
                <button
                    onClick={() => handleDelete(app.id)}
                    className="bg-[#91486c] text-white p-2 rounded-sm hover:opacity-90 transition-colors shadow-sm flex items-center justify-center"
                    title="Delete"
                >
                    <FaTrash className="w-3 h-3" />
                </button>
            </div>

            <div>
                <div className="flex items-center mb-3 pr-24">
                    {app.applicationType === 'JOB' ? (
                        <FaBriefcase className="w-6 h-6 text-[#312e81] mr-3 flex-shrink-0" />
                    ) : (
                        <FaGraduationCap className="w-6 h-6 text-[#312e81] mr-3 flex-shrink-0" />
                    )}
                    <div>
                        <h3 className="text-lg font-bold text-[#312e81] truncate leading-tight" title={app.title}>{app.title}</h3>
                        <p className="text-xs text-purple-900/60 font-bold truncate">
                            {app.company?.name || 'Unknown Company'}
                        </p>
                    </div>
                </div>

                <div className="space-y-2 mb-2">
                    <div className="flex flex-wrap gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold border ${getStatusBadgeClass(app.appStatus)}`}>
                            {app.appStatus}
                        </span>
                    </div>

                    <div className="text-xs text-purple-900 font-medium flex flex-col gap-1 mt-2">
                        {app.appStatus === 'DRAFT' ? (
                            <>
                                <div className="flex items-center">
                                    <FaCalendarAlt className="mr-1.5 text-purple-900/40" />
                                    <span>Created: {new Date(app.creationDate).toLocaleDateString()}</span>
                                </div>
                                {app.submitDeadline && (
                                    <div className="flex items-center text-red-800">
                                        <FaCalendarAlt className="mr-1.5 text-red-800/40" />
                                        <span>Deadline: {new Date(app.submitDeadline).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="flex items-center">
                                    <FaCalendarAlt className="mr-1.5 text-purple-900/40" />
                                    <span>Submitted: {app.submitDate ? new Date(app.submitDate).toLocaleDateString() : '-'}</span>
                                </div>
                                {app.responseDeadline && (
                                    <div className="flex items-center text-indigo-800">
                                        <FaCalendarAlt className="mr-1.5 text-indigo-800/40" />
                                        <span>Response By: {new Date(app.responseDeadline).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#f5c6cf] flex flex-col">
                <p className="text-[10px] text-purple-900/50 italic text-center truncate">
                    {app.documents?.length > 0 ? `${app.documents.length} document(s) attached` : 'No documents attached'}
                </p>
            </div>
        </div>
    );

    return (
        <div id="list" className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-purple-900 drop-shadow-sm">My Applications</h1>
                        <div className="w-20 h-1 bg-gradient-to-r from-purple-900 to-pink-400 rounded-full mt-2"></div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
                        <div className="flex gap-2">
                            <div className="relative">
                                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-900/50 text-xs" />
                                <select 
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="pl-8 pr-4 py-2.5 rounded-md border-2 border-[#f5c6cf] bg-white text-sm font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer hover:bg-white/80 transition-colors w-full sm:w-auto"
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="DRAFT">Draft</option>
                                    <option value="SUBMITTED">Submitted</option>
                                    <option value="UNDER_REVIEW">Under Review</option>
                                    <option value="ACCEPTED">Accepted</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                            </div>
                            
                            <div className="relative">
                                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-900/50 text-xs" />
                                <select 
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="pl-8 pr-4 py-2.5 rounded-md border-2 border-[#f5c6cf] bg-white text-sm font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer hover:bg-white/80 transition-colors w-full sm:w-auto"
                                >
                                    <option value="ALL">All Types</option>
                                    <option value="JOB">Job</option>
                                    <option value="UNIVERSITY">University</option>
                                    <option value="LYCEE">Lycee</option>
                                    <option value="COURSE">Course</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="relative flex-grow sm:flex-grow-0">
                                <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-900/50 text-xs" />
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="pl-8 pr-4 py-2.5 rounded-md border-2 border-[#f5c6cf] bg-white text-sm font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer hover:bg-white/80 transition-colors w-full sm:w-auto"
                                >
                                    <option value="DATE_NEWEST">Newest First</option>
                                    <option value="DATE_OLDEST">Oldest First</option>
                                    <option value="COMPANY_ASC">Company (A-Z)</option>
                                    <option value="COMPANY_DESC">Company (Z-A)</option>
                                    <option value="TITLE_ASC">Title (A-Z)</option>
                                    <option value="TITLE_DESC">Title (Z-A)</option>
                                </select>
                            </div>

                            <Link
                                to="/applications/new"
                                className="bg-[#6b21a8] text-white px-6 py-2.5 rounded-md font-bold shadow-md hover:opacity-90 transition-all whitespace-nowrap text-center flex items-center justify-center text-sm"
                            >
                                New Application
                            </Link>
                        </div>
                    </div>
                </div>

                {isFiltered && (
                    <div className="flex justify-end mb-6">
                        <button 
                            onClick={clearFilters}
                            className="flex items-center gap-2 text-[#90636b] text-sm font-bold hover:opacity-80 transition-all"
                        >
                            <span>Filters active</span>
                            <FaTimes className="text-xs" />
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mx-auto"></div>
                        <p className="mt-4 text-purple-900 font-bold">Loading applications...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        {/* Jobs Column */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-md p-6 shadow-xl border border-white/30 flex flex-col h-full">
                            <div className="flex items-center mb-6">
                                <div className="bg-[#312e81]/10 p-2 rounded-full mr-3">
                                    <FaBriefcase className="text-[#312e81] w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-purple-900">
                                    Job Applications <span className="text-purple-900 text-lg font-normal">({jobApplications.length})</span>
                                </h2>
                            </div>
                            
                            <div className="flex-1">
                                {jobApplications.length > 0 ? (
                                    jobApplications.map(app => <ApplicationCard key={app.id} app={app} />)
                                ) : (
                                    <div className="bg-white/40 border-2 border-dashed border-[#f5c6cf] rounded-md p-8 text-center">
                                        <p className="text-purple-900/60 font-medium">
                                            {applications.length > 0 ? "No job applications match your filters." : "No job applications yet."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Education Column */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-md p-6 shadow-xl border border-white/30 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="bg-[#312e81]/10 p-2 rounded-full mr-3">
                                        <FaGraduationCap className="text-[#312e81] w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-bold text-purple-900">
                                        Education <span className="text-purple-900 text-lg font-normal">({eduApplications.length})</span>
                                    </h2>
                                </div>
                            </div>

                            <div className="flex-1">
                                {eduApplications.length > 0 ? (
                                    eduApplications.map(app => <ApplicationCard key={app.id} app={app} />)
                                ) : (
                                    <div className="bg-white/40 border-2 border-dashed border-[#f5c6cf] rounded-md p-8 text-center">
                                        <p className="text-[#646cff]/60 font-medium">
                                            {applications.length > 0 ? "No education applications match your filters." : "No education applications yet."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicationsPage;