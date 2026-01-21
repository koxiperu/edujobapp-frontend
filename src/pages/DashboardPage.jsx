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
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-purple-900 drop-shadow-sm">Dashboard Overview</h1>
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

                    <div className="relative z-10 w-full space-y-6">
                        
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                            
                            {/* LEFT COLUMN: Critical Attention Needed (80%) */}
                            <div className="lg:col-span-4 space-y-6">
                                <h2 className="text-2xl font-bold text-purple-900 flex items-center italic">
                                    <span className="mr-3">⚠️</span> Critical Attention Needed
                                </h2>

                                <div className="grid grid-cols-1 gap-6">
                                    {/* Drafts expiring soon */}
                                    <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-none overflow-hidden border border-[#90636b]">
                                        <div className="bg-[#90636b]/10 px-6 py-3 border-b border-[#90636b]">
                                            <h3 className="text-[#90636b] font-bold flex items-center text-sm uppercase tracking-wider">
                                                Drafts expiring soon (Submission &lt; 7 days)
                                            </h3>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-[#90636b]">
                                                <thead className="bg-[#90636b]/30">
                                                    <tr>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-[#90636b] uppercase tracking-wider">Title</th>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-[#90636b] uppercase tracking-wider">Company</th>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-[#90636b] uppercase tracking-wider">Deadline</th>
                                                        <th className="px-6 py-4"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-transparent divide-y divide-[#90636b]">
                                                    {criticalDrafts.map(app => (
                                                        <tr key={app.id} className="hover:bg-[#f5c6cf]/10 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#312e81]">{app.title}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-medium">{app.company?.name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#854d0e] italic">
                                                                {new Date(app.submitDeadline).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <button onClick={() => navigate(`/applications/${app.id}/edit`)} className="text-[#646cff] font-bold hover:underline">Complete Now</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {criticalDrafts.length === 0 && (
                                                        <tr>
                                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">No urgent drafts.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Responses expected */}
                                    <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-none overflow-hidden border border-[#90636b]">
                                        <div className="bg-[#90636b]/10 px-6 py-3 border-b border-[#90636b]">
                                            <h3 className="text-[#90636b] font-bold text-sm uppercase tracking-wider">Responses due today or already passed</h3>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-[#90636b]">
                                                <thead className="bg-[#90636b]/30">
                                                    <tr>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-[#90636b] uppercase tracking-wider">Title</th>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-[#90636b] uppercase tracking-wider">Company</th>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-[#90636b] uppercase tracking-wider">Deadline</th>
                                                        <th className="px-6 py-4"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-transparent divide-y divide-[#90636b]">
                                                    {criticalPending.map(app => (
                                                        <tr key={app.id} className="hover:bg-[#f5c6cf]/10 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#312e81]">{app.title}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-medium">{app.company?.name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#ca8a04]">
                                                                {new Date(app.responseDeadline).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <button onClick={() => navigate(`/applications/${app.id}`)} className="text-[#646cff] font-bold hover:underline">View Details</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {criticalPending.length === 0 && (
                                                        <tr>
                                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">No imminent expected responses.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: 4 Overview Boxes (20%) */}
                            <div className="lg:col-span-1 flex flex-col gap-4">
                                {/* 1.1.0: Quick Totals */}
                                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-md shadow-md border border-[#f5c6cf] flex flex-col justify-center items-center aspect-square overflow-hidden hover:shadow-lg transition duration-200">
                                    <h2 className="text-xs sm:text-sm font-bold text-purple-900 mb-2 uppercase tracking-wider">Summary</h2>
                                    <div className="space-y-2 w-full px-2">
                                        <div className="flex items-center justify-between py-1 border-b border-[#f5c6cf]/30">
                                            <span className="text-[#90636b] font-bold text-[10px] uppercase truncate mr-2">Applications</span>
                                            <span className="text-lg font-black text-[#90636b]">{data.allApplications?.length || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-1 border-b border-[#f5c6cf]/30">
                                            <span className="text-[#423292] font-bold text-[10px] uppercase truncate mr-2">Documents</span>
                                            <span className="text-lg font-black text-[#423292]">{counts.documents}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-1">
                                            <span className="text-[#1a8377] font-bold text-[10px] uppercase truncate mr-2">Companies</span>
                                            <span className="text-lg font-black text-[#1a8377]">{counts.companies}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 1.1.a: Application Types */}
                                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-md shadow-md border border-[#f5c6cf] flex flex-col justify-center items-center aspect-square overflow-hidden hover:shadow-lg transition duration-200">
                                    <h2 className="text-xs sm:text-sm font-bold text-purple-900 mb-2 uppercase tracking-wider">Types</h2>
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

                                {/* 1.1.b: Application Statuses */}
                                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-md shadow-md border border-[#f5c6cf] flex flex-col justify-center items-center aspect-square overflow-hidden hover:shadow-lg transition duration-200">
                                    <h2 className="text-xs sm:text-sm font-bold text-purple-900 mb-2 uppercase tracking-wider">Success</h2>
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

                                {/* 1.1.c: Country Distribution */}
                                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-md shadow-md border border-[#f5c6cf] flex flex-col justify-center items-center aspect-square overflow-hidden hover:shadow-lg transition duration-200">
                                    <h2 className="text-xs sm:text-sm font-bold text-purple-900 mb-2 uppercase tracking-wider">Countries</h2>
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

                        {/* LAYER 3: Timeline Chart */}
                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-md shadow-md border border-[#f5c6cf]">
                            <h2 className="text-xl font-bold text-purple-900 mb-6 italic">Applications Creation Timeline</h2>
                            <div className="h-80 w-full">
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;