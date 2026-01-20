import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditCompanyPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState({
        name: '',
        type: 'EMPLOYER',
        country: '',
        address: '',
        website: '',
        phone: '',
        email: '',
        userId: null // Added userId to state
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const data = await api.companies.getById(id);
                // Ensure null values are handled and userId is preserved
                setCompany({
                    name: data.name || '',
                    type: data.type || 'EMPLOYER',
                    country: data.country || '',
                    address: data.address || '',
                    website: data.website || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    userId: data.userId // Capture the owner ID
                });
            } catch (err) {
                console.error("Failed to fetch company", err);
                setError("Failed to load company details.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.companies.update(id, company);
            navigate(`/companies/${id}`);
        } catch (err) {
            alert('Failed to update company: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        setCompany({ ...company, [e.target.name]: e.target.value });
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-indigo-800">Loading company data...</p>
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
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="mb-8">
                <button 
                    onClick={() => navigate(`/companies/${id}`)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors"
                >
                    <span className="mr-2">&larr;</span> Back to Details
                </button>
                <h1 className="text-3xl font-extrabold text-gray-900 mt-4">Edit Company</h1>
                <div className="w-20 h-1 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full mt-2"></div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-indigo-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Hidden input for userId is implicit in the state, but we don't display it */}
                    
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">Company Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={company.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="type" className="block text-sm font-semibold text-gray-900 mb-2">Type</label>
                            <select
                                name="type"
                                id="type"
                                value={company.type}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            >
                                <option value="EMPLOYER">Employer</option>
                                <option value="UNIVERSITY">University</option>
                                <option value="LYCEE">Lycee</option>
                                <option value="COURSE">Course Provider</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="country" className="block text-sm font-semibold text-gray-900 mb-2">Country</label>
                            <input
                                type="text"
                                name="country"
                                id="country"
                                value={company.country}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-semibold text-gray-900 mb-2">Address</label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            value={company.address}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="website" className="block text-sm font-semibold text-gray-900 mb-2">Website</label>
                            <input
                                type="url"
                                name="website"
                                id="website"
                                value={company.website}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                value={company.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={company.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/companies/${id}`)}
                            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCompanyPage;