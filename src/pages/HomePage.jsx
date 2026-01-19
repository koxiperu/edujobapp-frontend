import { useState, useEffect } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';

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
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                    Find Your Dream Job
                </h1>
                <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                    Connect with top companies and universities in Luxembourg.
                </p>
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
