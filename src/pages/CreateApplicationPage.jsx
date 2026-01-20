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
        <div className="max-w-2xl mx-auto px-4 py-10">
            <div className="bg-white rounded-lg shadow p-8">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">Create New Application</h1>

                {error && <div className="mb-4 p-4 text-red-700 bg-red-100 rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Software Engineer Intern"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        {loadingCompanies ? (
                            <p className="text-sm text-gray-500">Loading companies...</p>
                        ) : (
                            <select
                                name="companyId"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={formData.companyId}
                                onChange={handleChange}
                            >
                                <option value="">Select a Company</option>
                                {companies.map(company => (
                                    <option key={company.id} value={company.id}>{company.name}</option>
                                ))}
                            </select>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Don't see the company? <a href="/companies" className="text-indigo-600 hover:underline">Add it here</a>.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                            name="applicationType"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            rows="3"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
                            <input
                                type="date"
                                name="submitDeadline"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={formData.submitDeadline}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Expected Response</label>
                            <input
                                type="date"
                                name="responseDeadline"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={formData.responseDeadline}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Create Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateApplicationPage;
