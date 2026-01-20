import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

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
                    // Don't block page if apps fail to load
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

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-indigo-800">Loading company details...</p>
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <button 
                        onClick={() => navigate('/companies')}
                        className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors mb-2"
                    >
                        <span className="mr-2">&larr;</span> Back to Companies
                    </button>
                    <h1 className="text-3xl font-extrabold text-gray-900">{company.name}</h1>
                    <div className="flex items-center space-x-3 mt-2">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                            {company.type}
                        </span>
                        <span className="text-gray-500">{company.country}</span>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => navigate(`/companies/${id}/edit`)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        Edit Company
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors border border-red-200"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                {/* Main Info Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {company.website && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">Website</p>
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline break-all">
                                    {company.website}
                                </a>
                            </div>
                        )}
                        {company.email && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <a href={`mailto:${company.email}`} className="text-gray-900 hover:text-indigo-600 break-all">
                                    {company.email}
                                </a>
                            </div>
                        )}
                        {company.phone && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">Phone</p>
                                <p className="text-gray-900">{company.phone}</p>
                            </div>
                        )}
                        {company.address && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">Address</p>
                                <p className="text-gray-900">{company.address}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions - Moved here */}
                <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-indigo-900">Quick Actions</h3>
                        <p className="text-sm text-indigo-700">Apply for a job or record a new interaction with this company.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/applications/new', { state: { companyId: company.id } })}
                        className="whitespace-nowrap bg-white text-indigo-600 font-bold py-2 px-6 rounded-lg hover:bg-indigo-50 border border-indigo-200 transition-all shadow-sm"
                    >
                        Add Application
                    </button>
                </div>

                {/* Applications List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Applications ({applications.length})</h2>
                    {applications.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {applications.map(app => (
                                <div key={app.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{app.jobTitle}</h3>
                                            <p className="text-sm text-gray-500">Applied on {new Date(app.dateApplied).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                            app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                            app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No applications linked to this company yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyDetailsPage;