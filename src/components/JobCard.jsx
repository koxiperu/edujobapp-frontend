import React from 'react';

const JobCard = ({ job }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{job.title}</h3>
                    <p className="text-gray-600 font-medium">{job.company_name}</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide">
                        {job.location}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                        {new Date(job.date_posted).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <div className="mb-4">
                <p className="text-gray-600 text-sm line-clamp-3">
                    {/* Render HTML content safely if needed, or strip tags */}
                    {job.description.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {job.tags && job.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {tag}
                    </span>
                ))}
            </div>

            <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
            >
                Apply Now
            </a>
        </div>
    );
};

export default JobCard;
