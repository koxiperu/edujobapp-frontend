import { useState, useEffect } from 'react';
import api from '../services/api';

const CompaniesPage = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newCompany, setNewCompany] = useState({
        name: '',
        type: 'EMPLOYER',
        country: 'Luxembourg',
        address: '',
        website: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const data = await api.companies.getAll();
            setCompanies(data);
        } catch (error) {
            console.error("Failed to load companies");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.companies.create(newCompany);
            setIsCreating(false);
            setNewCompany({
                name: '',
                type: 'EMPLOYER',
                country: 'Luxembourg',
                address: '',
                website: '',
                phone: '',
                email: ''
            });
            fetchCompanies();
        } catch (error) {
            console.error("Failed to create company");
            alert("Failed to create company");
        }
    };

    const handleChange = (e) => {
        setNewCompany({ ...newCompany, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition-colors"
                >
                    {isCreating ? 'Cancel' : 'Add Company'}
                </button>
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded shadow mb-6 border border-indigo-100">
                    <h2 className="text-xl font-bold mb-4">Add New Company</h2>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="name" placeholder="Name" required className="border p-2 rounded" value={newCompany.name} onChange={handleChange} />
                        <select name="type" className="border p-2 rounded" value={newCompany.type} onChange={handleChange}>
                            <option value="EMPLOYER">Employer</option>
                            <option value="UNIVERSITY">University</option>
                            <option value="LYCEE">Lycee</option>
                            <option value="COURSE">CourseProvider</option>
                        </select>
                        <input type="text" name="country" placeholder="Country" required className="border p-2 rounded" value={newCompany.country} onChange={handleChange} />
                        <input type="text" name="address" placeholder="Address" className="border p-2 rounded" value={newCompany.address} onChange={handleChange} />
                        <input type="url" name="website" placeholder="Website" className="border p-2 rounded" value={newCompany.website} onChange={handleChange} />
                        <input type="tel" name="phone" placeholder="Phone" className="border p-2 rounded" value={newCompany.phone} onChange={handleChange} />
                        <input type="email" name="email" placeholder="Email" className="border p-2 rounded" value={newCompany.email} onChange={handleChange} />
                        <button type="submit" className="col-span-1 md:col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors">Save Company</button>
                    </form>
                </div>
            )}

            {loading ? (
                <p className="text-center text-gray-500">Loading companies...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => (
                        <div key={company.id} className="bg-white p-6 rounded shadow hover:shadow-lg transition duration-200">
                            <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                            <div className="flex items-center space-x-2 mb-2">
                                <span className={`text-xs px-2 py-1 rounded bg-gray-100 text-gray-600`}>{company.type}</span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-sm text-gray-500">{company.country}</span>
                            </div>
                            {company.website && <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-sm hover:underline block truncate mb-1">{company.website}</a>}
                            <div className="mt-4 text-xs text-gray-400 flex justify-between">
                                <span>{company.email || 'No email'}</span>
                                {/* Actions like Edit/Delete could go here */}
                            </div>
                        </div>
                    ))}
                    {companies.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-10">
                            No companies found. Click "Add Company" to create one.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CompaniesPage;
