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
            <div id="form" className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mx-auto"></div>
                    <p className="mt-4 text-purple-900 font-bold">Loading application data...</p>
                </div>
            </div>
        );
    }

    return (
        <div id="form" className="min-h-screen flex items-center justify-center relative">
            {/* Absolute Back Button */}
            <div className="absolute top-8 left-8 z-20">
                <button 
                    onClick={() => navigate(`/applications/${id}`)}
                    className="text-purple-900 hover:opacity-80 font-bold flex items-center transition-colors text-sm"
                >
                    <span className="mr-2">&larr;</span> Back to Details
                </button>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex items-center justify-center">
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

                    <div className="relative z-10 w-full max-w-3xl">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-extrabold tracking-tight text-purple-900 drop-shadow-sm">
                                Edit Application
                            </h1>
                            <div className="w-20 h-1 bg-gradient-to-r from-purple-900 to-pink-400 mx-auto rounded-full mt-2"></div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-700 border-l-4 border-red-500 rounded-md shadow-sm">
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-[#f5c6cf] p-6 space-y-6 shadow-sm">
                                <h2 className="text-xl font-bold text-purple-900 border-b border-[#f5c6cf] pb-4">Basic Information</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Application Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Company</label>
                                        <select
                                            name="companyId"
                                            value={formData.companyId}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
                                        >
                                            <option value="">Select Company</option>
                                            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Type</label>
                                        <select
                                            name="applicationType"
                                            value={formData.applicationType}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
                                        >
                                            <option value="JOB">Job</option>
                                            <option value="UNIVERSITY">University</option>
                                            <option value="LYCEE">Lycee</option>
                                            <option value="COURSE">Course</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Description</label>
                                        <textarea
                                            name="description"
                                            rows="4"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-[#f5c6cf] p-6 space-y-6 shadow-sm">
                                <h2 className="text-xl font-bold text-purple-900 border-b border-[#f5c6cf] pb-4">Status & Timeline</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Status</label>
                                            <select
                                                name="appStatus"
                                                value={formData.appStatus}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
                                            >
                                                <option value="DRAFT">Draft</option>
                                                <option value="SUBMITTED">Submitted</option>
                                                <option value="UNDER_REVIEW">Under Review</option>
                                                <option value="ACCEPTED">Accepted</option>
                                                <option value="REJECTED">Rejected</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Result Notes</label>
                                            <textarea
                                                name="resultNotes"
                                                rows="4"
                                                value={formData.resultNotes}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                placeholder="Final outcome notes..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6 md:border-l md:border-[#f5c6cf] md:pl-8">
                                        <div>
                                            <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Submission Date</label>
                                            <input
                                                type="date"
                                                name="submitDate"
                                                value={formData.submitDate}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Application Deadline</label>
                                            <input
                                                type="date"
                                                name="submitDeadline"
                                                value={formData.submitDeadline}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Response Deadline</label>
                                            <input
                                                type="date"
                                                name="responseDeadline"
                                                value={formData.responseDeadline}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-[#f5c6cf] p-6 space-y-6 shadow-sm">
                                <div className="flex justify-between items-center border-b border-[#f5c6cf] pb-4">
                                    <h2 className="text-xl font-bold text-purple-900">Documents</h2>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/documents', { state: { isCreating: true } })}
                                        className="bg-[#423292] text-white px-3 py-1.5 rounded-md text-xs font-bold hover:opacity-90 transition-all shadow-sm"
                                    >
                                        Upload New
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {allDocuments.length > 0 ? (
                                        allDocuments.map(doc => (
                                            <label key={doc.id} className={`flex items-center p-3 rounded-md border transition-all cursor-pointer ${
                                                formData.documentIds.includes(doc.id) 
                                                ? 'bg-[#f5c6cf]/30 border-[#90636b] ring-1 ring-[#90636b]' 
                                                : 'border-[#f5c6cf] hover:bg-white/30'
                                            }`}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.documentIds.includes(doc.id)}
                                                    onChange={() => handleDocumentToggle(doc.id)}
                                                    className="w-4 h-4 text-[#423292] rounded focus:ring-[#423292] border-[#f5c6cf]"
                                                />
                                                <span className="ml-3 text-sm font-bold text-purple-900 truncate">{doc.fileName}</span>
                                            </label>
                                        ))
                                    ) : (
                                        <p className="col-span-2 text-sm text-purple-800 italic">No documents available to link.</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-[#423292] text-white font-bold py-4 px-6 rounded-md text-lg shadow-xl hover:opacity-90 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                                >
                                    {saving ? 'Saving Changes...' : 'Update Application'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate(`/applications/${id}`)}
                                    className="px-8 py-4 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 font-bold hover:bg-[#f5c6cf]/20 transition-all"
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

export default EditApplicationPage;