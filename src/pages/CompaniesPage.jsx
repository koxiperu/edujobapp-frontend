import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { FaEye, FaEdit, FaTrash, FaBuilding, FaMapMarkerAlt, FaGlobe, FaEnvelope, FaInfoCircle } from 'react-icons/fa';

const CompaniesPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [notification, setNotification] = useState(null);
    const [newCompany, setNewCompany] = useState({
        name: '',
        type: 'EMPLOYER',
        country: 'Luxembourg',
        address: '',
        website: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const data = await api.companies.getAll();
            setCompanies(data);
        } catch (error) {
            console.error("Failed to load companies", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const companyData = {
                ...newCompany,
                userId: user?.id
            };
            
            await api.companies.create(companyData);
            setIsCreating(false);
            setNewCompany({
                name: '',
                type: 'EMPLOYER',
                country: 'Luxembourg',
                address: '',
                website: '',
                phone: '',
                email: ''
            });
            fetchCompanies();
        } catch (error) {
            console.error("Failed to create company", error);
            alert("Failed to create company");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this company?')) {
            try {
                await api.companies.delete(id);
                setCompanies(companies.filter(c => c.id !== id));
            } catch (err) {
                alert('Failed to delete company: ' + err.message);
            }
        }
    };

    const handleChange = (e) => {
        setNewCompany({ ...newCompany, [e.target.name]: e.target.value });
    };

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 4000);
    };

    return (
        <div id="list" className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-purple-900 drop-shadow-sm">Companies</h1>
                        <div className="w-20 h-1 bg-gradient-to-r from-purple-900 to-pink-400 rounded-full mt-2"></div>
                    </div>
                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        className="bg-[#6b21a8] text-white px-6 py-3 rounded-md font-bold shadow-md hover:opacity-90 transition-all"
                    >
                        {isCreating ? 'Cancel' : 'Add Company'}
                    </button>
                </div>

                {isCreating && (
                    <div
                        className="rounded-md p-8 mb-12 shadow-2xl relative overflow-hidden flex flex-col items-center"
                        style={{
                            backgroundImage: 'url(/backgrounds/form-bg.jpg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {/* Soft pastel overlay */}
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

                        <div className="relative z-10 w-full max-w-3xl">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-extrabold text-purple-900">Add New Company</h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-purple-900 to-pink-400 mx-auto rounded-full mt-2"></div>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Company Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            value={newCompany.name}
                                            onChange={handleChange}
                                            placeholder="Company Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Type</label>
                                        <select
                                            name="type"
                                            className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
                                            value={newCompany.type}
                                            onChange={handleChange}
                                        >
                                            <option value="EMPLOYER">Employer</option>
                                            <option value="UNIVERSITY">University</option>
                                            <option value="LYCEE">Lycee</option>
                                            <option value="COURSE">Course Provider</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            required
                                            className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            value={newCompany.country}
                                            onChange={handleChange}
                                            placeholder="e.g. Luxembourg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            value={newCompany.email}
                                            onChange={handleChange}
                                            placeholder="contact@company.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Website</label>
                                        <input
                                            type="url"
                                            name="website"
                                            className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            value={newCompany.website}
                                            onChange={handleChange}
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            value={newCompany.phone}
                                            onChange={handleChange}
                                            placeholder="+352..."
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            value={newCompany.address}
                                            onChange={handleChange}
                                            placeholder="Street, City, Postal Code"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-[#6b21a8] text-white px-8 py-4 rounded-md font-bold text-lg shadow-xl hover:opacity-90 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        Save Company
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mx-auto"></div>
                        <p className="mt-4 text-purple-900 font-bold">Loading companies...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {companies.map((company) => (
                            <div key={company.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-md shadow-md hover:shadow-lg transition duration-200 flex flex-col justify-between border border-[#f5c6cf] relative">
                                {/* Top Right Action Buttons */}
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <button
                                        onClick={() => navigate(`/companies/${company.id}`)}
                                        className="bg-[#646cff] text-white p-2 rounded-sm hover:opacity-90 transition-colors shadow-sm flex items-center justify-center"
                                        title="View"
                                    >
                                        <FaEye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => navigate(`/companies/${company.id}/edit`)}
                                        className="bg-[#423292] text-white p-2 rounded-sm hover:opacity-90 transition-colors shadow-sm flex items-center justify-center"
                                        title="Edit"
                                    >
                                        <FaEdit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (company.applicationCount > 0) {
                                                showNotification(`* Used in ${company.applicationCount} application(s). Delete applications first.`);
                                            } else {
                                                handleDelete(company.id);
                                            }
                                        }}
                                        className={`p-2 rounded-sm transition-colors shadow-sm flex items-center justify-center ${
                                            company.applicationCount > 0 
                                            ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed' 
                                            : 'bg-[#91486c] text-white hover:opacity-90'
                                        }`}
                                        title={company.applicationCount > 0 ? "Cannot delete company used in applications" : "Delete"}
                                    >
                                        <FaTrash className="w-4 h-4" />
                                    </button>
                                </div>

                                <div>
                                    <div className="flex items-center mb-3 pr-28">
                                        <FaBuilding className="w-8 h-8 text-[#312e81] mr-3 flex-shrink-0" />
                                        <h3 className="text-lg font-bold text-[#312e81] truncate" title={company.name}>{company.name}</h3>
                                    </div>
                                    <div className="space-y-2 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <span className={`text-xs px-2 py-1 rounded-full font-bold bg-indigo-50 text-indigo-700`}>
                                                {company.type}
                                            </span>
                                            {company.country && (
                                                <div className="flex items-center text-xs text-purple-900 font-medium">
                                                    <FaMapMarkerAlt className="mr-1 text-purple-900/40" />
                                                    {company.country}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {company.website && (
                                            <div className="flex items-center text-xs text-indigo-600 truncate">
                                                <FaGlobe className="mr-2 text-indigo-600/40" />
                                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                    {company.website.replace(/^https?:\/\//, '')}
                                                </a>
                                            </div>
                                        )}
                                        
                                        {company.email && (
                                            <div className="flex items-center text-xs text-purple-900/70 truncate">
                                                <FaEnvelope className="mr-2 text-purple-900/30" />
                                                {company.email}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-[#f5c6cf] flex flex-col">
                                    <p className="text-[10px] text-purple-900/50 italic text-center">
                                        {company.applicationCount > 0 ? `Linked to ${company.applicationCount} application(s)` : 'No linked applications'}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {companies.length === 0 && (
                            <div className="col-span-full text-center text-purple-900 py-10 bg-white/40 backdrop-blur-sm rounded-md border-2 border-dashed border-[#f5c6cf]">
                                <p className="text-lg font-bold">No companies found</p>
                                <p className="text-sm mt-1">Get started by adding a new company.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Floating Notification */}
            {notification && (
                <div className="fixed bottom-10 right-10 z-50 animate-bounce">
                    <div className="bg-[#91486c] text-white px-6 py-3 rounded-md shadow-2xl border-2 border-[#f5c6cf] flex items-center space-x-3">
                        <FaInfoCircle />
                        <span className="font-bold text-sm">{notification}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompaniesPage;