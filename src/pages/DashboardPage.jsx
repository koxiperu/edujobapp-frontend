import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList,
    LineChart, Line
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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
            { name: 'Accepted', value: accepted, color: '#10b981' },
            { name: 'Rejected', value: rejected, color: '#ef4444' },
            { name: 'Others', value: others, color: '#9ca3af' }
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
        const gapVal = maxVal * 0.25; // Increased gap for labels

        return sorted.map(item => ({
            ...item,
            eduVal: -item.edu-gapVal,
            jobVal: item.job+gapVal,
            gapNeg: -gapVal,
            gapPos: gapVal,
            labelVal: 0
        }));
    }, [data]);

    // 1.2 Timeline Bar Chart
    const timelineData = useMemo(() => {
        if (!data?.allApplications) return [];
        const map = {};
        data.allApplications.forEach(app => {
            const date = new Date(app.creationDate).toLocaleDateString();
            map[date] = (map[date] || 0) + 1;
        });
        return Object.entries(map)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [data]);

    // 1.3 Critical Applications
    const { criticalDrafts, criticalPending } = useMemo(() => {
        if (!data?.allApplications) return { criticalDrafts: [], criticalPending: [] };

        const now = new Date();
        const in7Days = new Date();
        in7Days.setDate(now.getDate() + 7);

        // End of today for inclusive comparison
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Dashboard Overview
            </h1>

            {/* LAYER 1: 4 Overview Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1.1.0: Quick Totals */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center aspect-square overflow-hidden">
                    <h2 className="text-xs sm:text-lg font-bold text-gray-800 mb-2 sm:mb-4 uppercase tracking-wider">Summary</h2>
                    <div className="space-y-2 sm:space-y-4">
                        <div className="flex items-center justify-between p-2 sm:p-3 bg-indigo-50 rounded-xl">
                            <span className="text-indigo-700 font-semibold text-[9px] sm:text-sm uppercase truncate mr-2">Applications</span>
                            <span className="text-base sm:text-2xl font-black text-indigo-900">{data.allApplications?.length || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 sm:p-3 bg-emerald-50 rounded-xl">
                            <span className="text-emerald-700 font-semibold text-[9px] sm:text-sm uppercase truncate mr-2">Documents</span>
                            <span className="text-base sm:text-2xl font-black text-emerald-900">{counts.documents}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 sm:p-3 bg-amber-50 rounded-xl">
                            <span className="text-amber-700 font-semibold text-[9px] sm:text-sm uppercase truncate mr-2">Companies</span>
                            <span className="text-base sm:text-2xl font-black text-amber-900">{counts.companies}</span>
                        </div>
                    </div>
                </div>

                {/* 1.1.a: Application Types */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center aspect-square overflow-hidden">
                    <h2 className="text-xs sm:text-lg font-bold text-gray-800 mb-2 sm:mb-4 uppercase tracking-wider">Types</h2>
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
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 1.1.b: Application Statuses */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center aspect-square overflow-hidden">
                    <h2 className="text-xs sm:text-lg font-bold text-gray-800 mb-2 sm:mb-4 uppercase tracking-wider">Success</h2>
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
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 1.1.c: Country Distribution (Butterfly Style) */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center aspect-square overflow-hidden">
                    <h2 className="text-xs sm:text-lg font-bold text-gray-800 mb-2 sm:mb-4 uppercase tracking-wider">Countries</h2>
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
                                    formatter={(value, name) => {
                                        if (name === "Education" || name === "Jobs") return [Math.abs(value), name];
                                        return null;
                                    }}
                                />
                                <Legend
                                    verticalAlign="top"
                                    height={24}
                                    wrapperStyle={{ fontSize: '10px' }}
                                    payload={[
                                        { value: 'Edu', type: 'rect', color: '#ec4899' },
                                        { value: 'Jobs', type: 'rect', color: '#6366f1' }
                                    ]}
                                />
                                <Bar dataKey="eduVal" name="Education" fill="#ec4899" stackId="stack" radius={[2, 0, 0, 2]} />
                                <Bar dataKey="gapPos" stackId="stack" fill="transparent" isAnimationActive={false}>
                                    <LabelList
                                        dataKey="code"
                                        position="center"
                                        style={{ fill: '#4b5563', fontSize: 10, fontWeight: 'bold' }}
                                    />
                                </Bar>
                                <Bar dataKey="gapPos" stackId="stack" fill="transparent" isAnimationActive={false} />
                                <Bar dataKey="jobVal" name="Jobs" fill="#6366f1" stackId="stack" radius={[0, 2, 2, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* LAYER 2: Critical Applications Table (Moved up) */}
            <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <span className="mr-3">⚠️</span> Critical Attention Needed
                </h2>

                <div className="grid grid-cols-1 gap-8">
                    {/* Drafts with deadline < 7 days */}
                    <div className="bg-white rounded-3xl overflow-hidden border border-red-100 shadow-lg shadow-red-50">
                        <div className="bg-red-500 px-6 py-3">
                            <h3 className="text-white font-bold flex items-center">
                                Drafts expiring soon (Submission &lt; 7 days)
                            </h3>
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Company</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Deadline</th>
                                        <th className="px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {criticalDrafts.map(app => (
                                        <tr key={app.id} className="hover:bg-red-50/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{app.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.company?.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600 italic">
                                                {new Date(app.submitDeadline).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <button onClick={() => navigate(`/applications/${app.id}/edit`)} className="text-indigo-600 font-bold hover:underline">Complete Now</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {criticalDrafts.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-400 italic">No urgent drafts.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Responses expected - Today or Overdue */}
                    <div className="bg-white rounded-3xl overflow-hidden border border-amber-100 shadow-md">
                        <div className="bg-amber-500 px-6 py-3">
                            <h3 className="text-white font-bold">Responses due today or already passed</h3>
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Company</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Deadline</th>
                                        <th className="px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {criticalPending.map(app => (
                                        <tr key={app.id} className="hover:bg-amber-50/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{app.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.company?.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-amber-600">
                                                {new Date(app.responseDeadline).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <button onClick={() => navigate(`/applications/${app.id}`)} className="text-indigo-600 font-bold hover:underline">View Details</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {criticalPending.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-400 italic">No imminent expected responses.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* LAYER 3: Timeline Chart (Moved down) */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
                <h2 className="text-xl font-bold text-gray-900 mb-6 italic">Applications Creation Timeline</h2>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timelineData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#9ca3af', fontSize: 11 }}
                                axisLine={{ stroke: '#e5e7eb' }}
                            />
                            <YAxis
                                tick={{ fill: '#9ca3af', fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="count" 
                                stroke="#6366f1" 
                                strokeWidth={3} 
                                dot={{ fill: '#6366f1', r: 4 }} 
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;