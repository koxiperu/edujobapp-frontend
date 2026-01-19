import { useState, useEffect } from 'react';
import api from '../services/api';

const DocumentsPage = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const data = await api.documents.getAll();
            setDocuments(data);
        } catch (error) {
            console.error("Failed to load documents");
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
            // Clear input logic manually if needed, or relies on state if input controlled (hard with file input)
            // Ideally we reset the form or input ref.
            document.getElementById('fileUpload').value = "";
            fetchDocuments();
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed");
        } finally {
            setUploading(false);
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
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Documents</h1>

            {/* Upload Section */}
            <div className="bg-white p-6 rounded shadow mb-8 border border-indigo-100">
                <h2 className="text-lg font-bold mb-4">Upload New Document</h2>
                <form onSubmit={handleUpload} className="flex gap-4 items-end flex-wrap">
                    <div>
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
                        className={`px-4 py-2 rounded text-white shadow-sm transition-colors ${!file || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
            </div>

            {/* Documents List */}
            <h2 className="text-xl font-bold mb-4">Your Documents</h2>
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : (
                <div className="bg-white shadow overflow-hidden rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {documents.map((doc) => (
                            <li key={doc.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition duration-150">
                                <div className="flex items-center">
                                    <svg className="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                    <div>
                                        <p className="text-sm font-medium text-indigo-600 truncate">{doc.file_name}</p>
                                        <p className="text-xs text-gray-500">Uploaded on {new Date(doc.upload_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-4 items-center">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${doc.doc_status === 'READY' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {doc.doc_status}
                                    </span>
                                    <button
                                        onClick={() => handleDownload(doc.id, doc.file_name)}
                                        className="text-indigo-600 hover:text-indigo-900 font-medium text-sm border border-indigo-600 px-3 py-1 rounded hover:bg-indigo-50 transition-colors"
                                    >
                                        Download
                                    </button>
                                </div>
                            </li>
                        ))}
                        {documents.length === 0 && (
                            <li className="px-6 py-10 text-center text-gray-500">No documents found. Upload one above!</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DocumentsPage;
