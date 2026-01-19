import { useState, useEffect } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';
import loadingQr from '../assets/fake_qr_code_donate.png';

const HomePage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await api.jobs.getAll();
                const jobsList = Array.isArray(data) ? data : (data.data || []);
                setJobs(jobsList);
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Hero / Description Section */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-10 mb-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-2/3 pr-8">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
                        Track Your Path to Success
                    </h1>

                    <div className="text-lg text-indigo-100 mb-8 leading-relaxed">
                        <ul className="space-y-4 list-none">
                            <li className="flex items-start">
                                <span className="mr-2 text-2xl">🎓</span>
                                <div>
                                    <strong className="block text-xl text-white">Education & Career</strong>
                                    <span>Discover opportunities with top companies and universities.</span>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-2xl">📁</span>
                                <div>
                                    <strong className="block text-xl text-white">All-in-One Platform</strong>
                                    <span>Manage job applications and documents in one centralized place.</span>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-2xl">🚀</span>
                                <div>
                                    <strong className="block text-xl text-white">Stay Organized</strong>
                                    <span>Stop juggling spreadsheets—start building your career today.</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <a href="/register" className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-50 transition transform hover:-translate-y-1">
                            Start for Free
                        </a>
                    </div>
                </div>

                {/* Donation / Profile Block */}
                <div className="mt-8 md:mt-0 md:w-1/3 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-center">
                    <p className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-90">Support the Developer</p>
                    <div className="bg-white p-4 rounded-xl inline-block shadow-inner mb-4">
                        <img src={loadingQr} alt="Donate QR" className="w-32 h-32 object-cover mx-auto opacity-80" />
                    </div>
                    <p className="text-xs text-indigo-200 mb-4">Scan to donate or visit my site</p>
                    <a href="https://bushueva.lu" target="_blank" rel="noopener noreferrer" className="text-sm font-bold hover:underline">
                        bushueva.lu
                    </a>
                </div>
            </div>

            <div className="mb-10 text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 border-b-4 border-indigo-500 inline-block pb-2">Ready to start build your future? Apply right now</h2>
            </div>

            {loading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map(job => (
                        <JobCard key={job.slug || job.id || Math.random()} job={job} />
                    ))}
                    {jobs.length === 0 && (
                        <div className="col-span-full text-center text-gray-500">
                            No jobs found. Check back later!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HomePage;
