import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const DocumentsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchDocuments();
        
        // Auto-open upload form if state is passed
        if (location.state?.isCreating) {
            setIsCreating(true);
        }
    }, [location.state]);

    const fetchDocuments = async () => {
        try {
            const data = await api.documents.getAll();
            setDocuments(data);
        } catch (error) {
            console.error("Failed to load documents", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.documents.upload(formData);
            setFile(null);
            document.getElementById('fileUpload').value = "";
            setIsCreating(false);
            fetchDocuments();
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed: " + (error.message || "Unknown error"));
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await api.documents.delete(id);
                setDocuments(documents.filter(d => d.id !== id));
            } catch (err) {
                alert('Failed to delete document: ' + err.message);
            }
        }
    };

    const handleDownload = async (id, fileName) => {
        try {
            const blob = await api.documents.download(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error("Download failed", error);
            alert("Download failed");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition-colors"
                >
                    {isCreating ? 'Cancel' : 'Upload Document'}
                </button>
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded shadow mb-6 border border-indigo-100">
                    <h2 className="text-xl font-bold mb-4">Upload New Document</h2>
                    <form onSubmit={handleUpload} className="flex gap-4 items-end flex-wrap">
                        <div className="flex-grow">
                            <input
                                id="fileUpload"
                                type="file"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!file || uploading}
                            className={`px-6 py-2 rounded font-bold text-white shadow-sm transition-colors ${!file || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-indigo-800">Loading documents...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((doc) => (
                        <div key={doc.id} className="bg-white p-6 rounded shadow hover:shadow-lg transition duration-200 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center mb-3">
                                    <svg className="w-8 h-8 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                    <h3 className="text-lg font-bold text-gray-900 truncate" title={doc.fileName}>{doc.fileName}</h3>
                                </div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium 
                                        ${doc.docStatus === 'READY' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {doc.docStatus}
                                    </span>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-500">{new Date(doc.uploadDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col">
                                <div className="flex justify-between space-x-2">
                                    <button
                                        onClick={() => navigate(`/documents/${doc.id}`)}
                                        className="flex-1 bg-indigo-50 text-indigo-700 px-2 py-2 rounded text-sm font-bold hover:bg-indigo-100 transition-colors"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleDownload(doc.id, doc.fileName)}
                                        className="flex-1 bg-gray-50 text-gray-700 px-2 py-2 rounded text-sm font-bold hover:bg-gray-100 transition-colors"
                                    >
                                        Download
                                    </button>
                                    <button
                                        onClick={() => handleDelete(doc.id)}
                                        disabled={doc.applicationCount > 0}
                                        className={`flex-1 px-2 py-2 rounded text-sm font-bold transition-colors border ${
                                            doc.applicationCount > 0 
                                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                                            : 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200'
                                        }`}
                                        title={doc.applicationCount > 0 ? "Cannot delete document used in applications" : ""}
                                    >
                                        Delete
                                    </button>
                                </div>
                                {doc.applicationCount > 0 && (
                                    <p className="text-[10px] text-red-500 font-medium italic mt-2 text-center">
                                        * Cannot delete: used in {doc.applicationCount} application(s)
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                    {documents.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <p className="text-lg font-medium">No documents found</p>
                            <p className="text-sm mt-1">Upload a resume or cover letter to get started.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DocumentsPage;