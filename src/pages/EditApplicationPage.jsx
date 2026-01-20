import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const EditApplicationPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [companies, setCompanies] = useState([]);
    const [allDocuments, setAllDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        applicationType: 'JOB',
        appStatus: 'DRAFT',
        submitDate: '',
        submitDeadline: '',
        responseDeadline: '',
        resultNotes: '',
        companyId: '',
        documentIds: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appData, companiesData, docsData] = await Promise.all([
                    api.applications.getById(id),
                    api.companies.getAll(),
                    api.documents.getAll()
                ]);

                setCompanies(companiesData);
                setAllDocuments(docsData);
                
                setFormData({
                    title: appData.title || '',
                    description: appData.description || '',
                    applicationType: appData.applicationType || 'JOB',
                    appStatus: appData.appStatus || 'DRAFT',
                    submitDate: appData.submitDate || '',
                    submitDeadline: appData.submitDeadline || '',
                    responseDeadline: appData.responseDeadline || '',
                    resultNotes: appData.resultNotes || '',
                    companyId: appData.company?.id || '',
                    documentIds: appData.documents?.map(d => d.id) || []
                });
            } catch (err) {
                console.error("Failed to load data", err);
                setError("Failed to load application details.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDocumentToggle = (docId) => {
        setFormData(prev => {
            const currentIds = prev.documentIds;
            if (currentIds.includes(docId)) {
                return { ...prev, documentIds: currentIds.filter(id => id !== docId) };
            } else {
                return { ...prev, documentIds: [...currentIds, docId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...formData,
                companyId: parseInt(formData.companyId),
                userId: user?.id
            };
            await api.applications.update(id, payload);
            navigate(`/applications/${id}`);
        } catch (err) {
            alert('Failed to update application: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-indigo-800">Loading application data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="mb-8">
                <button 
                    onClick={() => navigate(`/applications/${id}`)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors"
                >
                    <span className="mr-2">&larr;</span> Back to Details
                </button>
                <h1 className="text-3xl font-extrabold text-gray-900 mt-4">Edit Application</h1>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-700 border-l-4 border-red-500 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Basic Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Application Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
                            <select
                                name="companyId"
                                value={formData.companyId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            >
                                <option value="">Select Company</option>
                                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                            <select
                                name="applicationType"
                                value={formData.applicationType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            >
                                <option value="JOB">Job</option>
                                <option value="UNIVERSITY">University</option>
                                <option value="LYCEE">Lycee</option>
                                <option value="COURSE">Course</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Status & Timeline</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Status side (Left) */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                <select
                                    name="appStatus"
                                    value={formData.appStatus}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                >
                                    <option value="DRAFT">Draft</option>
                                    <option value="SUBMITTED">Submitted</option>
                                    <option value="UNDER_REVIEW">Under Review</option>
                                    <option value="ACCEPTED">Accepted</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Result Notes</label>
                                <textarea
                                    name="resultNotes"
                                    rows="4"
                                    value={formData.resultNotes}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="Final outcome notes..."
                                />
                            </div>
                        </div>

                        {/* Timeline side (Right) */}
                        <div className="space-y-6 md:border-l md:border-gray-50 md:pl-8">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Submission Date</label>
                                <input
                                    type="date"
                                    name="submitDate"
                                    value={formData.submitDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Application Deadline</label>
                                <input
                                    type="date"
                                    name="submitDeadline"
                                    value={formData.submitDeadline}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Response Deadline</label>
                                <input
                                    type="date"
                                    name="responseDeadline"
                                    value={formData.responseDeadline}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                        <h2 className="text-xl font-bold text-gray-900">Documents</h2>
                        <button
                            type="button"
                            onClick={() => navigate('/documents', { state: { isCreating: true } })}
                            className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            Upload New
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {allDocuments.length > 0 ? (
                            allDocuments.map(doc => (
                                <label key={doc.id} className={`flex items-center p-3 rounded-xl border transition-all cursor-pointer ${
                                    formData.documentIds.includes(doc.id) 
                                    ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' 
                                    : 'border-gray-100 hover:bg-gray-50'
                                }`}>
                                    <input
                                        type="checkbox"
                                        checked={formData.documentIds.includes(doc.id)}
                                        onChange={() => handleDocumentToggle(doc.id)}
                                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                                    />
                                    <span className="ml-3 text-sm font-medium text-gray-700 truncate">{doc.fileName}</span>
                                </label>
                            ))
                        ) : (
                            <p className="col-span-2 text-sm text-gray-500 italic">No documents available to link.</p>
                        )}
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-indigo-600 text-white font-bold py-4 px-6 rounded-2xl hover:bg-indigo-700 hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {saving ? 'Saving Changes...' : 'Update Application'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/applications/${id}`)}
                        className="px-8 py-4 rounded-2xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditApplicationPage;
