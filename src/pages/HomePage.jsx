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
        <div id="list" className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Hero Section with Background Image */}
                <div
                    className="rounded-md p-12 mb-12 shadow-2xl relative overflow-hidden"
                >
                    {/* Soft pastel overlay */}
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

                    <div className="relative z-10">
                        <h1 className="text-5xl font-extrabold tracking-tight mb-6 text-purple-900 text-center drop-shadow-sm">
                            Track Your Path to Success
                        </h1>
                        <p className="text-xl text-center text-purple-800 mb-10 max-w-3xl mx-auto font-medium">
                            Your all-in-one companion for managing job applications, organizing documents, and discovering opportunities.
                        </p>

                        {/* Two Column Layout: Features List + Donation */}
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                            {/* Left Side - Feature List */}
                            <div className="md:w-2/3 w-full">

                                <ul className="space-y-6">
                                    <li className="flex items-start">
                                        <span className="text-4xl mr-4 bg-[#818cf8] rounded-full p-3 shadow-md">🎓</span>
                                        <div>
                                            <h3 className="text-xl font-bold text-purple-900 mb-1">Education & Career</h3>
                                            <p className="text-purple-800 font-medium">
                                                Manage all applications in one app with a comfortable view for jobs, universities, and educational programs.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-4xl mr-4 bg-[#1a8377] rounded-full p-3 shadow-md">📁</span>
                                        <div>
                                            <h3 className="text-xl font-bold text-fuchsia-900 mb-1">Document Management</h3>
                                            <p className="text-fuchsia-800 font-medium">
                                                Upload, store, and attach documents like CVs, cover letters, and certificates to your applications.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-4xl mr-4 bg-[#f5c6cf] rounded-full p-3 shadow-md">⏰</span>
                                        <div>
                                            <h3 className="text-xl font-bold text-red-900 mb-1">Deadline Alerts</h3>
                                            <p className="text-red-800 font-medium">
                                                Red notifications for unsubmitted applications with deadlines less than 1 week away—never miss an opportunity.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-4xl mr-4 bg-[#423292] rounded-full p-3 shadow-md">🚀</span>
                                        <div>
                                            <h3 className="text-xl font-bold text-teal-900 mb-1">Stay Organized</h3>
                                            <p className="text-teal-800 font-medium">
                                                Stop juggling spreadsheets and emails. Track application statuses, companies, and deadlines all in one place.
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Right Side - Donation + CTA - Centered on mobile */}
                            <div className="md:w-1/3 w-full max-w-md flex flex-col items-center">
                                <div className="text-center w-full">
                                    <p className="text-sm font-bold uppercase tracking-wider mb-3 text-purple-900">Support the Developer</p>
                                    <div className="bg-white p-4 rounded-xl inline-block shadow-lg mb-3 border-2 border-purple-200">
                                        <img src={loadingQr} alt="Donate QR" className="w-32 h-32 object-cover mx-auto" />
                                    </div>
                                    <p className="text-xs text-purple-800 mb-2 font-semibold">Scan to donate</p>
                                    <a href="https://bushueva.lu" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-purple-700 hover:text-purple-900 hover:underline block mb-4">
                                        bushueva.lu
                                    </a>
                                </div>

                                {/* Start for Free Button */}
                                <a
                                    href="/register"
                                    className="mt-6 bg-[#423292] text-white px-10 py-4 rounded-md font-bold text-lg shadow-xl hover:opacity-90 transition-all transform hover:-translate-y-1 w-full text-center"
                                >
                                    Start for Free
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Jobs Section */}
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-extrabold text-[#423292] mb-3">Ready to build your future?</h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mx-auto rounded-full shadow-sm"></div>
                </div>

                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map(job => (
                            <JobCard key={job.slug || job.id || Math.random()} job={job} />
                        ))}
                        {jobs.length === 0 && (
                            <div className="col-span-full text-center text-gray-500 py-10">
                                No jobs found. Check back later!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
        
            );
};

            export default HomePage;
