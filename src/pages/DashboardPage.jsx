import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import api from '../services/api';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList,
    AreaChart, Area
} from 'recharts';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [counts, setCounts] = useState({ companies: 0, documents: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, companiesRes, docsRes] = await Promise.all([
                    api.dashboard.getStats(),
                    api.companies.getAll(),
                    api.documents.getAll()
                ]);
                setData(statsRes);
                setCounts({
                    companies: companiesRes.length,
                    documents: docsRes.length
                });
            } catch (error) {
                console.error("Dashboard API failed", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // 1.1.a Pie Chart: Education vs Jobs
    const typeData = useMemo(() => {
        if (!data?.applicationsByType) return [];
        return Object.entries(data.applicationsByType).map(([name, value]) => ({ name, value }));
    }, [data]);

    const getTypeColor = (name) => {
        const n = name.toUpperCase();
        if (n.includes('JOB') || n.includes('EMPLOYER')) return '#646cff';
        if (n.includes('COURSE')) return '#8b5cf6';
        if (n.includes('UNIVERSITY')) return '#1a8377';
        if (n.includes('LYCEE')) return '#ca8a04';
        return '#6b7280';
    };

    // 1.1.b Pie Chart: Accepted, Rejected, Others
    const statusData = useMemo(() => {
        if (!data?.applicationsByStatus) return [];
        let accepted = 0;
        let rejected = 0;
        let others = 0;

        Object.entries(data.applicationsByStatus).forEach(([status, count]) => {
            if (status === 'ACCEPTED') accepted += count;
            else if (status === 'REJECTED') rejected += count;
            else others += count;
        });

        return [
            { name: 'Accepted', value: accepted, color: '#1a8377' },
            { name: 'Rejected', value: rejected, color: '#90636b' },
            { name: 'Unknown', value: others, color: '#6b7280' }
        ];
    }, [data]);

    // 1.1.c Population Pyramid: Countries (Job vs Edu)
    const countryPyramidData = useMemo(() => {
        if (!data?.allApplications) return [];
        const map = {};
        data.allApplications.forEach(app => {
            const countryName = app.company?.country || 'Unknown';
            const code = countryName.substring(0, 2).toUpperCase();
            if (!map[code]) map[code] = { code, job: 0, edu: 0 };
            if (app.applicationType === 'JOB') map[code].job++;
            else map[code].edu++;
        });

        const sorted = Object.values(map).sort((a, b) => b.job - a.job);
        const maxVal = Math.max(...sorted.map(i => Math.max(i.job, i.edu)), 1);
        const gapVal = maxVal * 0.25;

        return sorted.map(item => ({
            ...item,
            eduVal: -item.edu-gapVal,
            jobVal: item.job+gapVal,
            gapNeg: -gapVal,
            gapPos: gapVal,
            labelVal: 0
        }));
    }, [data]);

    // 1.2 Timeline Area Chart (Jobs vs Edu)
    const timelineData = useMemo(() => {
        if (!data?.allApplications) return [];
        const map = {};
        
        data.allApplications.forEach(app => {
            const date = new Date(app.creationDate).toLocaleDateString();
            if (!map[date]) map[date] = { date, job: 0, edu: 0 };
            
            if (app.applicationType === 'JOB') map[date].job++;
            else map[date].edu++;
        });

        return Object.values(map)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [data]);

    // 1.3 Critical Applications
    const { criticalDrafts, criticalPending } = useMemo(() => {
        if (!data?.allApplications) return { criticalDrafts: [], criticalPending: [] };

        const now = new Date();
        const in7Days = new Date();
        in7Days.setDate(now.getDate() + 7);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const drafts = data.allApplications.filter(app => {
            if (app.appStatus !== 'DRAFT' || !app.submitDeadline) return false;
            const deadline = new Date(app.submitDeadline);
            return deadline <= in7Days;
        });

        const pending = data.allApplications.filter(app => {
            if (!['SUBMITTED', 'UNDER_REVIEW'].includes(app.appStatus) || !app.responseDeadline) return false;
            const deadline = new Date(app.responseDeadline);
            return deadline <= endOfToday;
        });

        return { criticalDrafts: drafts, criticalPending: pending };
    }, [data]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center text-indigo-600">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                Loading your dashboard...
            </div>
        );
    }

    if (!data) return <div className="text-center py-20 text-red-500">Failed to load dashboard data.</div>;

    return (
        <div id="list" className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-10 text-center flex flex-col items-center">
                    <h1 className="text-4xl text-center font-extrabold text-purple-900 drop-shadow-sm">Dashboard</h1>
                    <div className="w-20 h-1 bg-gradient-to-r from-purple-900 to-pink-400 rounded-full mt-2"></div>
                </div>

                <div
                    className="w-full rounded-md p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center"
                    style={{
                        backgroundImage: 'url(/backgrounds/list-bg.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Soft pastel overlay */}
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

                    <div className="relative z-10 w-full">
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* LEFT COLUMN (2/3): Timeline + 4 Charts */}
                            <div className="lg:col-span-2 space-y-6">
                                
                                {/* 1. Timeline Chart (Top Left) */}
                                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-md shadow-md border border-[#f5c6cf]">
                                    <h2 className="text-xl font-bold text-purple-900 mb-4 italic">Applications Creation Timeline</h2>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={timelineData}>
                                                <defs>
                                                    <linearGradient id="colorJob" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#646cff" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#646cff" stopOpacity={0}/>
                                                    </linearGradient>
                                                    <linearGradient id="colorEdu" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#854d0e" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#854d0e" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                                <XAxis
                                                    dataKey="date"
                                                    tick={{ fill: '#6b7280', fontSize: 11 }}
                                                    axisLine={{ stroke: '#e5e7eb' }}
                                                />
                                                <YAxis
                                                    tick={{ fill: '#6b7280', fontSize: 11 }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '6px', border: '1px solid #f5c6cf', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                                />
                                                <Area 
                                                    type="monotone" 
                                                    dataKey="job" 
                                                    name="Jobs"
                                                    stroke="#646cff" 
                                                    fillOpacity={1} 
                                                    fill="url(#colorJob)" 
                                                />
                                                <Area 
                                                    type="monotone" 
                                                    dataKey="edu" 
                                                    name="Education"
                                                    stroke="#854d0e" 
                                                    fillOpacity={1} 
                                                    fill="url(#colorEdu)" 
                                                />
                                                <Legend />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* 2. 4 Overview Boxes (Bottom Left - 2x2 Grid) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Summary */}
                                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-md shadow-md border border-[#f5c6cf] flex flex-col justify-center items-center h-64 hover:shadow-lg transition duration-200">
                                        <h2 className="text-sm font-bold text-purple-900 mb-2 uppercase tracking-wider">Summary</h2>
                                        <div className="space-y-4 w-full px-4">
                                            <div className="flex items-center justify-between py-2 border-b border-[#f5c6cf]/30">
                                                <span className="text-[#90636b] font-bold text-xs uppercase truncate mr-2">Applications</span>
                                                <span className="text-2xl font-black text-[#90636b]">{data.allApplications?.length || 0}</span>
                                            </div>
                                            <div className="flex items-center justify-between py-2 border-b border-[#f5c6cf]/30">
                                                <span className="text-[#423292] font-bold text-xs uppercase truncate mr-2">Documents</span>
                                                <span className="text-2xl font-black text-[#423292]">{counts.documents}</span>
                                            </div>
                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-[#1a8377] font-bold text-xs uppercase truncate mr-2">Companies</span>
                                                <span className="text-2xl font-black text-[#1a8377]">{counts.companies}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Types */}
                                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-md shadow-md border border-[#f5c6cf] flex flex-col justify-center items-center h-64 hover:shadow-lg transition duration-200">
                                        <h2 className="text-sm font-bold text-purple-900 mb-2 uppercase tracking-wider">Types</h2>
                                        <div className="flex-grow w-full min-h-0">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={typeData}
                                                        innerRadius="50%"
                                                        outerRadius="80%"
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {typeData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={getTypeColor(entry.name)} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ borderRadius: '6px', border: '1px solid #f5c6cf' }} />
                                                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Statuses */}
                                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-md shadow-md border border-[#f5c6cf] flex flex-col justify-center items-center h-64 hover:shadow-lg transition duration-200">
                                        <h2 className="text-sm font-bold text-purple-900 mb-2 uppercase tracking-wider">Success</h2>
                                        <div className="flex-grow w-full min-h-0">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={statusData}
                                                        innerRadius="50%"
                                                        outerRadius="80%"
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {statusData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ borderRadius: '6px', border: '1px solid #f5c6cf' }} />
                                                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Countries */}
                                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-md shadow-md border border-[#f5c6cf] flex flex-col justify-center items-center h-64 hover:shadow-lg transition duration-200">
                                        <h2 className="text-sm font-bold text-purple-900 mb-2 uppercase tracking-wider">Countries</h2>
                                        <div className="flex-grow w-full min-h-0">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    layout="vertical"
                                                    data={countryPyramidData}
                                                    margin={{ left: 0, right: 0, bottom: 0 }}
                                                    stackOffset="sign"
                                                    barSize={12}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="code" type="category" hide />
                                                    <Tooltip
                                                        cursor={{ fill: '#f9fafb' }}
                                                        contentStyle={{ borderRadius: '6px', border: '1px solid #f5c6cf' }}
                                                        formatter={(value, name) => [Math.abs(value), name]}
                                                    />
                                                    <Legend
                                                        verticalAlign="top"
                                                        height={24}
                                                        wrapperStyle={{ fontSize: '10px' }}
                                                        payload={[
                                                            { value: 'Edu', type: 'rect', color: '#854d0e' },
                                                            { value: 'Jobs', type: 'rect', color: '#646cff' }
                                                        ]}
                                                    />
                                                    <Bar dataKey="eduVal" name="Education" fill="#854d0e" stackId="stack" radius={[2, 0, 0, 2]} />
                                                    <Bar dataKey="gapPos" stackId="stack" fill="transparent" isAnimationActive={false}>
                                                        <LabelList
                                                            dataKey="code"
                                                            position="center"
                                                            style={{ fill: '#4b5563', fontSize: 10, fontWeight: 'bold' }}
                                                        />
                                                    </Bar>
                                                    <Bar dataKey="gapPos" stackId="stack" fill="transparent" isAnimationActive={false} />
                                                    <Bar dataKey="jobVal" name="Jobs" fill="#646cff" stackId="stack" radius={[0, 2, 2, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN (1/3): Alerts (Drafts & Pending) */}
                            <div className="lg:col-span-1 space-y-4">
                                
                                {/* Critical Drafts - Error Style */}
                                {criticalDrafts.map(app => (
                                    <div key={app.id} className="bg-red-50 border-l-4 border-red-500 p-4 shadow-md rounded-r-md flex flex-col gap-2 relative group hover:shadow-lg transition-all">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <FaExclamationTriangle className="text-red-500" />
                                                <span className="font-bold text-red-800 uppercase text-xs tracking-wider">Submission deadline soon</span>
                                            </div>
                                            <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                                                Draft
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{app.title}</h3>
                                            <p className="text-sm text-gray-600">{app.company?.name}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs font-bold text-red-700">
                                                Deadline: {new Date(app.submitDeadline).toLocaleDateString()}
                                            </span>
                                            <button 
                                                onClick={() => navigate(`/applications/${app.id}/edit`)} 
                                                className="text-xs bg-red-100 hover:bg-red-200 text-red-700 font-bold px-3 py-1 rounded transition-colors"
                                            >
                                                Apply Now
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Critical Pending - Warning Style */}
                                {criticalPending.map(app => (
                                    <div key={app.id} className="bg-yellow-50 border-l-4 border-yellow-500 p-4 shadow-md rounded-r-md flex flex-col gap-2 relative group hover:shadow-lg transition-all">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <FaExclamationTriangle className="text-yellow-500" />
                                                <span className="font-bold text-yellow-800 uppercase text-xs tracking-wider">Response Overdue</span>
                                            </div>
                                            <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                                                Pending
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{app.title}</h3>
                                            <p className="text-sm text-gray-600">{app.company?.name}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs font-bold text-yellow-700">
                                                Deadline: {new Date(app.responseDeadline).toLocaleDateString()}
                                            </span>
                                            <button 
                                                onClick={() => navigate(`/applications/${app.id}`)} 
                                                className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-bold px-3 py-1 rounded transition-colors"
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {criticalDrafts.length === 0 && criticalPending.length === 0 && (
                                    <div className="p-6 text-center text-gray-500 bg-white/50 rounded-md border border-dashed border-gray-300">
                                        <p className="italic">No critical alerts at this time. Great job!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;