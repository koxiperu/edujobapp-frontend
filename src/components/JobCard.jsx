import React from 'react';

const JobCard = ({ job }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-[#423292] mb-1 line-clamp-2">{job.title}</h3>
                    <p className="text-[#1a8377] font-medium">{job.company_name}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide whitespace-nowrap">
                        {job.location}
                    </span>
                    {job.remote && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide">
                            Remote
                        </span>
                    )}
                    {job.date_posted && (
                        <span className="text-xs text-gray-500 mt-1">
                            {new Date(job.date_posted).toLocaleDateString()}
                        </span>
                    )}
                </div>
            </div>

            <div className="mb-4 flex-grow">
                {job.description ? (
                    <p className="text-gray-600 text-sm line-clamp-3">
                        {job.description.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                    </p>
                ) : (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {job.job_types && job.job_types.map(type => (
                            <span key={type} className="text-xs text-[#90636b] bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                {type}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {job.tags && job.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {tag}
                    </span>
                ))}
            </div>

            <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-[#423292] hover:opacity-90 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-200 mt-auto"
            >
                Apply Now
            </a>
        </div>
    );
};

export default JobCard;
