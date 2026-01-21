import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const CreateApplicationPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [companies, setCompanies] = useState([]);
    const [loadingCompanies, setLoadingCompanies] = useState(true);

    // Initial form state
    const [formData, setFormData] = useState({
        title: '',
        companyId: '',
        applicationType: 'JOB',
        description: '',
        submitDeadline: '',
        responseDeadline: '',
        appStatus: 'DRAFT',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const data = await api.companies.getAll();
                setCompanies(data);
            } catch (err) {
                console.error("Failed to load companies", err);
            } finally {
                setLoadingCompanies(false);
            }
        };
        fetchCompanies();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                companyId: parseInt(formData.companyId),
                userId: user?.id
            };

            await api.applications.create(payload);
            navigate('/applications');
        } catch (err) {
            console.error(err);
            setError('Failed to create application.');
        }
    };

    return (
        <div id="form" className="min-h-screen flex items-center justify-center relative">
            {/* Absolute Back Button */}
            <div className="absolute top-8 left-8 z-20">
                <button 
                    onClick={() => navigate('/applications')}
                    className="text-purple-900 hover:opacity-80 font-bold flex items-center transition-colors text-sm"
                >
                    <span className="mr-2">&larr;</span> Back to Applications
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
                                Create Application
                            </h1>
                            <div className="w-20 h-1 bg-gradient-to-r from-purple-900 to-pink-400 mx-auto rounded-full mt-2"></div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Software Engineer Intern"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Company</label>
                                    {loadingCompanies ? (
                                        <p className="text-sm text-purple-800">Loading companies...</p>
                                    ) : (
                                        <select
                                            name="companyId"
                                            required
                                            className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
                                            value={formData.companyId}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select a Company</option>
                                            {companies.map(company => (
                                                <option key={company.id} value={company.id}>{company.name}</option>
                                            ))}
                                        </select>
                                    )}
                                    <p className="text-xs text-purple-800 mt-1 ml-1 italic">Don't see the company? <a href="/companies" className="text-[#1a8377] font-bold hover:underline">Add it here</a>.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Type</label>
                                    <select
                                        name="applicationType"
                                        className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
                                        value={formData.applicationType}
                                        onChange={handleChange}
                                    >
                                        <option value="JOB">Job</option>
                                        <option value="UNIVERSITY">University</option>
                                        <option value="LYCEE">Lycee</option>
                                        <option value="COURSE">Course</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Description</label>
                                    <textarea
                                        name="description"
                                        rows="3"
                                        className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        value={formData.description}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Application Deadline</label>
                                        <input
                                            type="date"
                                            name="submitDeadline"
                                            className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            value={formData.submitDeadline}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Expected Response</label>
                                        <input
                                            type="date"
                                            name="responseDeadline"
                                            className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            value={formData.responseDeadline}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <button
                                    type="submit"
                                    className="w-full bg-[#423292] text-white px-8 py-4 rounded-md font-bold text-lg shadow-xl hover:opacity-90 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    Create Application
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/applications')}
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

export default CreateApplicationPage;