import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const DocumentDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docData = await api.documents.getById(id);
                setDocument(docData);
                
                try {
                    const appsData = await api.documents.getApplications(id);
                    setApplications(appsData);
                } catch (appErr) {
                    console.warn("Could not fetch applications", appErr);
                }
            } catch (err) {
                console.error("Failed to fetch document details", err);
                setError("Failed to load document details.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await api.documents.delete(id);
                navigate('/documents');
            } catch (err) {
                alert('Failed to delete document: ' + err.message);
            }
        }
    };

    const handleDownload = async () => {
        try {
            const blob = await api.documents.download(id);
            const url = window.URL.createObjectURL(blob);
            const a = window.document.createElement('a');
            a.href = url;
            a.download = document.fileName;
            window.document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error("Download failed", error);
            alert("Download failed");
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-indigo-800">Loading document details...</p>
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <button 
                        onClick={() => navigate('/documents')}
                        className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors mb-2"
                    >
                        <span className="mr-2">&larr;</span> Back to Documents
                    </button>
                    <h1 className="text-3xl font-extrabold text-gray-900 break-all">{document.fileName}</h1>
                    <div className="flex items-center space-x-3 mt-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            document.docStatus === 'READY' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {document.docStatus}
                        </span>
                        <span className="text-gray-500">Uploaded on {new Date(document.uploadDate).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex space-x-3">
                        <button
                            onClick={handleDownload}
                            className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors border border-indigo-200 shadow-sm"
                        >
                            Download
                        </button>
                        <button
                            onClick={() => navigate(`/documents/${id}/edit`)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={document.applicationCount > 0}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors border ${
                                document.applicationCount > 0 
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                                : 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200'
                            }`}
                            title={document.applicationCount > 0 ? "Cannot delete document with linked applications" : ""}
                        >
                            Delete
                        </button>
                    </div>
                    {document.applicationCount > 0 && (
                        <p className="text-[10px] text-red-500 font-medium italic">
                            * Cannot delete document while used in {document.applicationCount} application(s)
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-8">
                {/* Main Info Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Document Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Filename</p>
                            <p className="text-gray-900 break-all">{document.fileName}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Status</p>
                            <p className="text-gray-900">{document.docStatus}</p>
                        </div>
                        {document.contentType && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">Type</p>
                                <p className="text-gray-900">{document.contentType}</p>
                            </div>
                        )}
                        {document.uploadDate && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">Upload Date</p>
                                <p className="text-gray-900">{new Date(document.uploadDate).toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Applications List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Linked Applications ({applications.length})</h2>
                    {applications.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {applications.map(app => (
                                <div key={app.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate('/applications')}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{app.title}</h3>
                                            <p className="text-sm text-gray-500">Applied on {app.submitDate ? new Date(app.submitDate).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                            app.appStatus === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                            app.appStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {app.appStatus}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No applications linked to this document yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentDetailsPage;
