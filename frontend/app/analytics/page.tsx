'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer, Cell
} from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://ai-job-tracker-production-fd21.up.railway.app/api/jobs/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const funnelColors = ['#8b5cf6', '#6366f1', '#34d399'];
  const statusColors: Record<string, string> = {
    Applied: '#60a5fa',
    Interviewing: '#fbbf24',
    Offered: '#34d399',
    Rejected: '#f87171',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-white font-bold text-xl">AI Job Tracker</h1>
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-gray-400 hover:text-white text-sm transition">Dashboard</a>
          <a href="/kanban" className="text-gray-400 hover:text-white text-sm transition">Kanban</a>
          <a href="/ai" className="text-gray-400 hover:text-white text-sm transition">AI Tools</a>
          <a href="/analytics" className="text-purple-400 text-sm font-medium">Analytics</a>
          <button
            onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}
            className="text-gray-400 hover:text-white text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-white text-2xl font-bold">Analytics</h2>
          <p className="text-gray-400 text-sm mt-1">Your job search performance at a glance</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-3xl font-bold text-white">{data?.total || 0}</div>
            <div className="text-gray-400 text-sm mt-1">Total Applications</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-3xl font-bold text-amber-400">{data?.byStatus?.Interviewing || 0}</div>
            <div className="text-gray-400 text-sm mt-1">Interviewing</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-3xl font-bold text-green-400">{data?.byStatus?.Offered || 0}</div>
            <div className="text-gray-400 text-sm mt-1">Offers Received</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-3xl font-bold text-purple-400">{data?.responseRate || 0}%</div>
            <div className="text-gray-400 text-sm mt-1">Response Rate</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Applications by Status */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Applications by Status</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={Object.entries(data?.byStatus || {}).map(([name, value]) => ({ name, value }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {Object.keys(data?.byStatus || {}).map((key) => (
                    <Cell key={key} fill={statusColors[key]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Application Funnel */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Application Funnel</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data?.funnel || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis dataKey="stage" type="category" tick={{ fill: '#9ca3af', fontSize: 12 }} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {(data?.funnel || []).map((_: any, index: number) => (
                    <Cell key={index} fill={funnelColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Applications Over Time</h3>
          {data?.timeline?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center">
              <p className="text-gray-600">Add more applications to see timeline data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}