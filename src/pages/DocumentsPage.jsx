import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { FaEye, FaDownload, FaTrash, FaInfoCircle } from 'react-icons/fa';

const DocumentsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [newDocData, setNewDocData] = useState({
        fileName: '',
        docStatus: 'READY',
        contentType: ''
    });
    const [isCreating, setIsCreating] = useState(false);
    const [notification, setNotification] = useState(null);

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
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setNewDocData(prev => ({ 
                ...prev, 
                fileName: selectedFile.name,
                contentType: selectedFile.type || ''
            }));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', newDocData.fileName);
        formData.append('docStatus', newDocData.docStatus);
        if (newDocData.contentType) {
            formData.append('contentType', newDocData.contentType);
        }

        try {
            await api.documents.upload(formData);
            setFile(null);
            setNewDocData({ fileName: '', docStatus: 'READY', contentType: '' });
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

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 4000);
    };

    return (
        <div id="list" className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-purple-900 drop-shadow-sm">Documents</h1>
                        <div className="w-20 h-1 bg-gradient-to-r from-purple-900 to-pink-400 rounded-full mt-2"></div>
                    </div>
                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        className="bg-[#6b21a8] text-white px-6 py-3 rounded-md font-bold shadow-md hover:opacity-90 transition-all"
                    >
                        {isCreating ? 'Cancel' : 'Upload Document'}
                    </button>
                </div>

                {isCreating && (
                    <div
                        className="rounded-md p-8 mb-12 shadow-2xl relative overflow-hidden flex flex-col items-center"
                        style={{
                            backgroundImage: 'url(/backgrounds/form-bg.jpg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {/* Soft pastel overlay */}
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

                        <div className="relative z-10 w-full max-w-2xl">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-extrabold text-purple-900">Upload New Document</h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-purple-900 to-pink-400 mx-auto rounded-full mt-2"></div>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Filename</label>
                                        <input
                                            type="text"
                                            required
                                            className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            value={newDocData.fileName}
                                            onChange={(e) => setNewDocData({...newDocData, fileName: e.target.value})}
                                            placeholder="Document name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Status</label>
                                        <select
                                            className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
                                            value={newDocData.docStatus}
                                            onChange={(e) => setNewDocData({...newDocData, docStatus: e.target.value})}
                                        >
                                            <option value="READY">Ready</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="NEED_TO_UPDATE">Need to Update</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-purple-900 mb-1 ml-1">Content Type (Optional)</label>
                                        <input
                                            type="text"
                                            className="block w-full px-4 py-3 rounded-md border-2 border-[#f5c6cf] bg-white/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            value={newDocData.contentType}
                                            onChange={(e) => setNewDocData({...newDocData, contentType: e.target.value})}
                                            placeholder="e.g. application/pdf"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-purple-900 mb-2 ml-1">Select File</label>
                                    <input
                                        id="fileUpload"
                                        type="file"
                                        required
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-purple-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-[#f5c6cf] file:text-[#90636b] hover:file:bg-[#f5c6cf]/80 cursor-pointer bg-white/30 rounded-md border-2 border-[#f5c6cf] p-1"
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={!file || uploading}
                                        className="w-full bg-[#6b21a8] text-white px-8 py-4 rounded-md font-bold text-lg shadow-xl hover:opacity-90 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {uploading ? 'Uploading...' : 'Confirm Upload'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mx-auto"></div>
                        <p className="mt-4 text-purple-900 font-bold">Loading documents...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documents.map((doc) => (
                            <div key={doc.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-md shadow-md hover:shadow-lg transition duration-200 flex flex-col justify-between border border-[#f5c6cf] relative">
                                {/* Top Right Action Buttons */}
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <button
                                        onClick={() => navigate(`/documents/${doc.id}`)}
                                        className="bg-[#646cff] text-white p-2 rounded-sm hover:opacity-90 transition-colors shadow-sm flex items-center justify-center"
                                        title="View"
                                    >
                                        <FaEye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDownload(doc.id, doc.fileName)}
                                        className="bg-[#423292] text-white p-2 rounded-sm hover:opacity-90 transition-colors shadow-sm flex items-center justify-center"
                                        title="Download"
                                    >
                                        <FaDownload className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (doc.applicationCount > 0) {
                                                showNotification(`* Used in ${doc.applicationCount} application(s). Delete applications first.`);
                                            } else {
                                                handleDelete(doc.id);
                                            }
                                        }}
                                        className={`p-2 rounded-sm transition-colors shadow-sm flex items-center justify-center ${
                                            doc.applicationCount > 0 
                                            ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed' 
                                            : 'bg-[#91486c] text-white hover:opacity-90'
                                        }`}
                                        title={doc.applicationCount > 0 ? "Cannot delete document used in applications" : "Delete"}
                                    >
                                        <FaTrash className="w-4 h-4" />
                                    </button>
                                </div>

                                <div>
                                    <div className="flex items-center mb-3 pr-28">
                                        <svg className="w-8 h-8 text-[#312e81] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                        <h3 className="text-lg font-bold text-[#312e81] truncate" title={doc.fileName}>{doc.fileName}</h3>
                                    </div>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className={`text-xs px-2 py-1 rounded-full font-bold 
                                            ${doc.docStatus === 'READY' ? 'bg-green-100 text-[#166534]' : 
                                              doc.docStatus === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 
                                              doc.docStatus === 'NEED_TO_UPDATE' ? 'bg-red-100 text-[#991b1b]' : 
                                              'bg-yellow-100 text-yellow-800'}`}>
                                            {doc.docStatus}
                                        </span>
                                        <span className="text-xs text-purple-900/40">•</span>
                                        <span className="text-xs text-purple-900 font-medium">{new Date(doc.uploadDate).toLocaleDateString()}</span>
                                    </div>
                                    {doc.contentType && (
                                        <div className="text-[10px] text-purple-900/60 font-mono mt-1 italic">
                                            Type: {doc.contentType}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-[#f5c6cf] flex flex-col">
                                    <p className="text-[10px] text-purple-900/50 italic text-center">
                                        {doc.applicationCount > 0 ? `Used in ${doc.applicationCount} application(s)` : 'Not used in any applications'}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {documents.length === 0 && (
                            <div className="col-span-full text-center text-purple-900 py-10 bg-white/40 backdrop-blur-sm rounded-md border-2 border-dashed border-[#f5c6cf]">
                                <p className="text-lg font-bold">No documents found</p>
                                <p className="text-sm mt-1">Upload a resume or cover letter to get started.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Floating Notification */}
            {notification && (
                <div className="fixed bottom-10 right-10 z-50 animate-bounce">
                    <div className="bg-[#991b1b] text-white px-6 py-3 rounded-md shadow-2xl border-2 border-[#f5c6cf] flex items-center space-x-3">
                        <FaInfoCircle />
                        <span className="font-bold text-sm">{notification}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentsPage;