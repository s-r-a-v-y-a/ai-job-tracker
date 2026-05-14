'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, usersRes] = await Promise.all([
        fetch('https://ai-job-tracker-production-fd21.up.railway.app/api/admin/stats', { headers }),
        fetch('https://ai-job-tracker-production-fd21.up.railway.app/api/admin/users', { headers }),
      ]);

      if (statsRes.status === 403) {
        setError('Access denied. Admin only.');
        setLoading(false);
        return;
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      setStats(statsData);
      setUsers(usersData);
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    Applied: 'text-blue-400',
    Interviewing: 'text-amber-400',
    Offered: 'text-green-400',
    Rejected: 'text-red-400',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading admin panel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl font-bold">🚫 {error}</p>
          <p className="text-gray-400 text-sm mt-2">This page is only accessible to admins.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-white font-bold text-xl">AI Job Tracker</h1>
          <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">ADMIN</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-gray-400 hover:text-white text-sm">Dashboard</a>
          <a href="/admin" className="text-purple-400 text-sm font-medium">Admin Panel</a>
          <button
            onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}
            className="text-gray-400 hover:text-white text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-white text-2xl font-bold">Admin Panel</h2>
          <p className="text-gray-400 text-sm mt-1">Platform overview and user management</p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-3xl font-bold text-white">{stats?.totalUsers || 0}</div>
            <div className="text-gray-400 text-sm mt-1">Total Users</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-3xl font-bold text-purple-400">{stats?.totalJobs || 0}</div>
            <div className="text-gray-400 text-sm mt-1">Total Applications</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-3xl font-bold text-green-400">
              {stats?.jobsByStatus?.find((j: any) => j.status === 'Offered')?.count || 0}
            </div>
            <div className="text-gray-400 text-sm mt-1">Total Offers</div>
          </div>
        </div>

        {/* Jobs by Status */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h3 className="text-white font-semibold mb-4">Applications by Status (Platform-wide)</h3>
          <div className="grid grid-cols-4 gap-4">
            {stats?.jobsByStatus?.map((j: any) => (
              <div key={j.status} className="text-center">
                <div className={`text-2xl font-bold ${statusColors[j.status] || 'text-white'}`}>
                  {j.count}
                </div>
                <div className="text-gray-400 text-sm">{j.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="text-white font-semibold">All Users</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-400 text-xs px-5 py-3">ID</th>
                <th className="text-left text-gray-400 text-xs px-5 py-3">Name</th>
                <th className="text-left text-gray-400 text-xs px-5 py-3">Email</th>
                <th className="text-left text-gray-400 text-xs px-5 py-3">Role</th>
                <th className="text-left text-gray-400 text-xs px-5 py-3">Applications</th>
                <th className="text-left text-gray-400 text-xs px-5 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="text-gray-400 text-sm px-5 py-3">{user.id}</td>
                  <td className="text-white text-sm px-5 py-3">{user.name || '—'}</td>
                  <td className="text-gray-300 text-sm px-5 py-3">{user.email}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.role === 'admin'
                        ? 'bg-purple-500/10 text-purple-400'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="text-white text-sm px-5 py-3 font-medium">
                    {user._count.jobs}
                  </td>
                  <td className="text-gray-400 text-sm px-5 py-3">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}