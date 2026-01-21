import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';

const CompanyDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const companyData = await api.companies.getById(id);
                setCompany(companyData);
                
                try {
                    const appsData = await api.companies.getApplications(id);
                    setApplications(appsData);
                } catch (appErr) {
                    console.warn("Could not fetch applications", appErr);
                }
            } catch (err) {
                console.error("Failed to fetch company details", err);
                setError("Failed to load company details.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this company?')) {
            try {
                await api.companies.delete(id);
                navigate('/companies');
            } catch (err) {
                alert('Failed to delete company: ' + err.message);
            }
        }
    };

    const handleDeleteApplication = async (appId) => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                await api.applications.delete(appId);
                setApplications(applications.filter(app => app.id !== appId));
            } catch (err) {
                alert('Failed to delete application: ' + err.message);
            }
        }
    };

    const handleEditApplication = (appId) => {
        navigate(`/applications/${appId}/edit`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            
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
                <p className="mt-4 text-purple-800">Loading company details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow">
                    <p className="text-red-700">{error}</p>
                    <button 
                        onClick={() => navigate('/companies')}
                        className="mt-4 text-red-700 font-bold hover:underline"
                    >
                        &larr; Back to Companies
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div id="list" className="min-h-screen flex items-center justify-center relative">
            <div className="absolute top-8 left-8 z-20">
                <button 
                    onClick={() => navigate('/companies')}
                    className="text-purple-900 hover:opacity-80 font-bold flex items-center transition-colors text-sm"
                >
                    <span className="mr-2">&larr;</span> Back to Companies
                </button>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex items-center justify-center">
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

                    <div className="relative z-10 w-full max-w-4xl">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-center mb-10 text-center md:text-left gap-4">
                            <div>
                                <h1 className="text-4xl font-extrabold tracking-tight text-purple-900 drop-shadow-sm">
                                    {company.name}
                                </h1>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
                                    <span className="px-3 py-1 rounded-full text-sm font-bold bg-purple-100 text-purple-800 border border-purple-200">
                                        {company.type}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/50 text-gray-600 border border-gray-200">
                                        {company.country}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => navigate(`/companies/${id}/edit`)}
                                        className="bg-[#423292] text-white px-4 py-2 rounded-md hover:opacity-90 font-medium transition-colors shadow-sm"
                                    >
                                        Edit Company
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={company.applicationCount > 0}
                                        className={`px-4 py-2 rounded-md font-medium transition-colors border ${
                                            company.applicationCount > 0 
                                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                                            : 'bg-[#91486c] text-white hover:opacity-90 border-[#91486c]'
                                        }`}
                                        title={company.applicationCount > 0 ? "Cannot delete company with linked applications" : ""}
                                    >
                                        Delete
                                    </button>
                                </div>
                                {company.applicationCount > 0 && (
                                    <p className="text-[10px] text-red-500 font-medium italic text-right">
                                        * In use
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Contact Info Card */}
                            <div className="bg-white/60 backdrop-blur-md rounded-md shadow-xl border border-white/50 p-8">
                                <h2 className="text-xl font-bold text-purple-900 mb-6 border-b border-purple-100 pb-2">Contact Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-purple-800 uppercase tracking-wider opacity-70">Website</p>
                                        {company.website ? (
                                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-indigo-600 hover:underline break-all block border-b border-purple-100/50 pb-1">
                                                {company.website}
                                            </a>
                                        ) : (
                                            <p className="text-lg font-medium text-gray-400 italic border-b border-purple-100/50 pb-1">Not provided</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-purple-800 uppercase tracking-wider opacity-70">Email</p>
                                        {company.email ? (
                                            <a href={`mailto:${company.email}`} className="text-lg font-medium text-gray-900 hover:text-indigo-600 break-all block border-b border-purple-100/50 pb-1">
                                                {company.email}
                                            </a>
                                        ) : (
                                            <p className="text-lg font-medium text-gray-400 italic border-b border-purple-100/50 pb-1">Not provided</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-purple-800 uppercase tracking-wider opacity-70">Phone</p>
                                        <p className="text-lg font-medium text-gray-900 border-b border-purple-100/50 pb-1">{company.phone || <span className="text-gray-400 italic">Not provided</span>}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-purple-800 uppercase tracking-wider opacity-70">Address</p>
                                        <p className="text-lg font-medium text-gray-900 border-b border-purple-100/50 pb-1">{company.address || <span className="text-gray-400 italic">Not provided</span>}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-gradient-to-r from-[#7ea7a2]/10 to-[#1a8377]/10 rounded-md p-6 border border-[#7ea7a2]/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                                <div>
                                    <h3 className="font-bold text-[#1a8377]">Quick Actions</h3>
                                    <p className="text-sm text-[#1a8377]/80">Apply for a job or a course with this company.</p>
                                </div>
                                <button 
                                    onClick={() => navigate('/applications/new', { state: { companyId: company.id } })}
                                    className="whitespace-nowrap bg-white text-[#1a8377] font-bold py-2 px-6 rounded-md hover:bg-[#7ea7a2]/10 border-2 border-[#7ea7a2] transition-all shadow-sm"
                                >
                                    Add Application
                                </button>
                            </div>

                            {/* Applications List */}
                            <div className="bg-white/60 backdrop-blur-md rounded-md shadow-xl border border-white/50 p-8">
                                <h2 className="text-xl font-bold text-purple-900 mb-6 border-b border-purple-100 pb-2">
                                    Applications <span className="text-purple-600 text-lg font-normal">({applications.length})</span>
                                </h2>
                                {applications.length > 0 ? (
                                    <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-none overflow-hidden border border-[#90636b]">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-[#90636b]">
                                                <thead className="bg-[#90636b]/30">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#90636b] uppercase tracking-wider">Title</th>
                                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#90636b] uppercase tracking-wider">Date Applied</th>
                                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#90636b] uppercase tracking-wider">Status</th>
                                                        <th scope="col" className="relative px-6 py-4">
                                                            <span className="sr-only">Actions</span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-transparent divide-y divide-[#90636b]">
                                                    {applications.map(app => (
                                                        <tr key={app.id} className="hover:bg-[#f5c6cf]/10 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-bold text-[#1a8377]">{app.title}</div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-purple-900 font-medium">{formatDate(app.submitDate)}</div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`text-xs font-bold uppercase tracking-wider ${
                                                                    app.appStatus === 'ACCEPTED' ? 'text-green-700' :
                                                                    app.appStatus === 'REJECTED' ? 'text-red-700' :
                                                                    'text-yellow-700'
                                                                }`}>
                                                                    {app.appStatus}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <div className="flex justify-end space-x-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleEditApplication(app.id)}
                                                                        className="bg-[#646cff] text-white p-2 rounded-sm hover:opacity-90 transition-colors shadow-sm flex items-center justify-center"
                                                                        title="Edit"
                                                                    >
                                                                        <FaEdit className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDeleteApplication(app.id)}
                                                                        className="bg-[#6b21a8] text-white p-2 rounded-sm hover:opacity-90 transition-colors shadow-sm flex items-center justify-center"
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
                                ) : (
                                    <div className="text-center py-8 bg-white/40 rounded-md border-2 border-dashed border-purple-100">
                                        <p className="text-gray-500 italic">No applications linked to this company yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetailsPage;