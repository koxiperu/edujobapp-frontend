import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const CreateApplicationPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [companies, setCompanies] = useState([]);
    const [allDocuments, setAllDocuments] = useState([]);
    const [loadingCompanies, setLoadingCompanies] = useState(true);
    const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);

    // Initial form state
    const [formData, setFormData] = useState({
        title: '',
        companyId: '',
        applicationType: 'JOB',
        description: '',
        submitDeadline: '',
        responseDeadline: '',
        appStatus: 'DRAFT',
        documentIds: []
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [companiesData, docsData] = await Promise.all([
                    api.companies.getAll(),
                    api.documents.getAll()
                ]);
                setCompanies(companiesData);
                setAllDocuments(docsData);
            } catch (err) {
                console.error("Failed to load data", err);
            } finally {
                setLoadingCompanies(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

                                {/* Unfolding Documents Section */}
                                <div className="border-2 border-[#f5c6cf] rounded-md bg-white/50 overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setIsDocumentsOpen(!isDocumentsOpen)}
                                        className="w-full px-4 py-3 flex items-center justify-between text-purple-900 font-bold hover:bg-[#f5c6cf]/20 transition-colors"
                                    >
                                        <span>Attach Documents {formData.documentIds.length > 0 && `(${formData.documentIds.length})`}</span>
                                        {isDocumentsOpen ? <FaChevronUp /> : <FaChevronDown />}
                                    </button>
                                    
                                    {isDocumentsOpen && (
                                        <div className="p-4 border-t border-[#f5c6cf] bg-white/30 max-h-60 overflow-y-auto">
                                            {allDocuments.length > 0 ? (
                                                <div className="space-y-2">
                                                    {allDocuments.map(doc => (
                                                        <label key={doc.id} className={`flex items-center p-2 rounded-md border transition-all cursor-pointer ${
                                                            formData.documentIds.includes(doc.id) 
                                                            ? 'bg-[#f5c6cf]/30 border-[#90636b] ring-1 ring-[#90636b]' 
                                                            : 'border-transparent hover:bg-white/50'
                                                        }`}>
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.documentIds.includes(doc.id)}
                                                                onChange={() => handleDocumentToggle(doc.id)}
                                                                className="w-4 h-4 text-[#423292] rounded focus:ring-[#423292] border-[#f5c6cf]"
                                                            />
                                                            <span className="ml-3 text-sm text-purple-900 truncate">{doc.fileName}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <p className="text-sm text-purple-800 italic mb-2">No documents available.</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate('/documents', { state: { isCreating: true } })}
                                                        className="text-xs bg-[#423292] text-white px-3 py-1.5 rounded-md font-bold hover:opacity-90"
                                                    >
                                                        Upload New
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
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