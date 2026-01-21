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
        userId: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const data = await api.companies.getById(id);
                setCompany({
                    name: data.name || '',
                    type: data.type || 'EMPLOYER',
                    country: data.country || '',
                    address: data.address || '',
                    website: data.website || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    userId: data.userId
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
            <div id="form" className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mx-auto"></div>
                    <p className="mt-4 text-purple-900 font-bold">Loading company data...</p>
                </div>
            </div>
        );
    }

    return (
        <div id="form" className="min-h-screen flex items-center justify-center relative">
            {/* Absolute Back Button */}
            <div className="absolute top-8 left-8 z-20">
                <button 
                    onClick={() => navigate(`/companies/${id}`)}
                    className="text-purple-900 hover:opacity-80 font-bold flex items-center transition-colors text-sm"
                >
                    <span className="mr-2">&larr;</span> Back to Details
                </button>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex items-center justify-center">
                <div
                    className="w-full rounded-md p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center"
                    style={{
                        backgroundImage: 'url(/backgrounds/form-bg.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Soft pastel overlay */}
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

                    <div className="relative z-10 w-full max-w-md">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-extrabold tracking-tight text-purple-900 drop-shadow-sm">
                                Edit Company
                            </h1>
                            <div className="w-20 h-1 bg-gradient-to-r from-purple-900 to-pink-400 mx-auto rounded-full mt-2"></div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-700 border-l-4 border-red-500 rounded-md shadow-sm">
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-bold text-purple-900 mb-1 ml-1">Company Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={company.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="type" className="block text-sm font-bold text-purple-900 mb-1 ml-1">Type</label>
                                        <select
                                            name="type"
                                            id="type"
                                            value={company.type}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
                                        >
                                            <option value="EMPLOYER">Employer</option>
                                            <option value="UNIVERSITY">University</option>
                                            <option value="LYCEE">Lycee</option>
                                            <option value="COURSE">Course Provider</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="country" className="block text-sm font-bold text-purple-900 mb-1 ml-1">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            id="country"
                                            value={company.country}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-bold text-purple-900 mb-1 ml-1">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        value={company.address}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="website" className="block text-sm font-bold text-purple-900 mb-1 ml-1">Website</label>
                                        <input
                                            type="url"
                                            name="website"
                                            id="website"
                                            value={company.website}
                                            onChange={handleChange}
                                            placeholder="https://example.com"
                                            className="w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-bold text-purple-900 mb-1 ml-1">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            id="phone"
                                            value={company.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-purple-900 mb-1 ml-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={company.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-[#423292] text-white px-8 py-4 rounded-md font-bold text-lg shadow-xl hover:opacity-90 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate(`/companies/${id}`)}
                                    className="w-full bg-white/50 text-purple-900 px-8 py-3 rounded-md font-bold border-2 border-[#f5c6cf] hover:bg-[#f5c6cf]/20 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCompanyPage;