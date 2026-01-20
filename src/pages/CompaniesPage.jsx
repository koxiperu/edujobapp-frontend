import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const CompaniesPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
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
            console.error("Failed to load companies");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            // Include current user's ID in the request
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
                alert('Failed to delete user: ' + err.message);
            }
        }
    };

    const handleChange = (e) => {
        setNewCompany({ ...newCompany, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition-colors"
                >
                    {isCreating ? 'Cancel' : 'Add Company'}
                </button>
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded shadow mb-6 border border-indigo-100">
                    <h2 className="text-xl font-bold mb-4">Add New Company</h2>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="name" placeholder="Name" required className="border p-2 rounded" value={newCompany.name} onChange={handleChange} />
                        <select name="type" className="border p-2 rounded" value={newCompany.type} onChange={handleChange}>
                            <option value="EMPLOYER">Employer</option>
                            <option value="UNIVERSITY">University</option>
                            <option value="LYCEE">Lycee</option>
                            <option value="COURSE">CourseProvider</option>
                        </select>
                        <input type="text" name="country" placeholder="Country" required className="border p-2 rounded" value={newCompany.country} onChange={handleChange} />
                        <input type="text" name="address" placeholder="Address" className="border p-2 rounded" value={newCompany.address} onChange={handleChange} />
                        <input type="url" name="website" placeholder="Website" className="border p-2 rounded" value={newCompany.website} onChange={handleChange} />
                        <input type="tel" name="phone" placeholder="Phone" className="border p-2 rounded" value={newCompany.phone} onChange={handleChange} />
                        <input type="email" name="email" placeholder="Email" className="border p-2 rounded" value={newCompany.email} onChange={handleChange} />
                        <button type="submit" className="col-span-1 md:col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors">Save Company</button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-indigo-800">Loading companies...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => (
                        <div key={company.id} className="bg-white p-6 rounded shadow hover:shadow-lg transition duration-200 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 truncate">{company.name}</h3>
                                <div className="flex items-center space-x-2 mb-2 mt-1">
                                    <span className={`text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-700 font-medium`}>{company.type}</span>
                                    {company.country && (
                                        <>
                                            <span className="text-xs text-gray-300">•</span>
                                            <span className="text-sm text-gray-500 truncate">{company.country}</span>
                                        </>
                                    )}
                                </div>
                                {company.website && (
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-sm hover:underline block truncate mb-1">
                                        {company.website}
                                    </a>
                                )}
                                {company.email && (
                                    <div className="text-xs text-gray-400 mt-2 truncate">
                                        {company.email}
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between space-x-2">
                                <button
                                    onClick={() => navigate(`/companies/${company.id}`)}
                                    className="flex-1 bg-indigo-50 text-indigo-700 px-3 py-2 rounded text-sm font-bold hover:bg-indigo-100 transition-colors"
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => navigate(`/companies/${company.id}/edit`)}
                                    className="flex-1 bg-gray-50 text-gray-700 px-3 py-2 rounded text-sm font-bold hover:bg-gray-100 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(company.id)}
                                    className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded text-sm font-bold hover:bg-red-100 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {companies.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <p className="text-lg font-medium">No companies found</p>
                            <p className="text-sm mt-1">Get started by adding a new company.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CompaniesPage;