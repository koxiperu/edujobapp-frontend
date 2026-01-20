import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditDocumentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState({
        fileName: '',
        docStatus: '',
        userId: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const data = await api.documents.getById(id);
                // Ensure null values are handled
                setDocument({
                    fileName: data.fileName || '',
                    docStatus: data.docStatus || '',
                    userId: data.userId
                });
            } catch (err) {
                console.error("Failed to fetch document", err);
                setError("Failed to load document details.");
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.documents.update(id, document);
            navigate(`/documents/${id}`);
        } catch (err) {
            alert('Failed to update document: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        setDocument({ ...document, [e.target.name]: e.target.value });
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-indigo-800">Loading document data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow">
                    <p className="text-red-700">{error}</p>
                    <button 
                        onClick={() => navigate('/documents')}
                        className="mt-4 text-red-700 font-bold hover:underline"
                    >
                        &larr; Back to Documents
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="mb-8">
                <button 
                    onClick={() => navigate(`/documents/${id}`)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors"
                >
                    <span className="mr-2">&larr;</span> Back to Details
                </button>
                <h1 className="text-3xl font-extrabold text-gray-900 mt-4">Edit Document</h1>
                <div className="w-20 h-1 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full mt-2"></div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-indigo-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="fileName" className="block text-sm font-semibold text-gray-900 mb-2">Filename</label>
                        <input
                            type="text"
                            name="fileName"
                            id="fileName"
                            value={document.fileName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="docStatus" className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                        <input
                            type="text"
                            name="docStatus"
                            id="docStatus"
                            value={document.docStatus}
                            readOnly
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 focus:outline-none cursor-not-allowed"
                            title="Status cannot be changed manually"
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
                            onClick={() => navigate(`/documents/${id}`)}
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

export default EditDocumentPage;

