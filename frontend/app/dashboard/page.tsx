'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Applied');
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://ai-job-tracker-production-fd21.up.railway.app/api/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addJob = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://ai-job-tracker-production-fd21.up.railway.app/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ company, role, status, notes })
      });
      const data = await res.json();
      setJobs([...jobs, data]);
      setCompany('');
      setRole('');
      setNotes('');
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteJob = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://ai-job-tracker-production-fd21.up.railway.app/api/jobs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const statusColors: Record<string, string> = {
    Applied: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Interviewing: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Offered: 'bg-green-500/10 text-green-400 border-green-500/20',
    Rejected: 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
  <h1 className="text-white font-bold text-xl">AI Job Tracker</h1>
  <div className="flex items-center gap-4">
    <a href="/dashboard" className="text-purple-400 text-sm font-medium">Dashboard</a>
    <a href="/kanban" className="text-gray-400 hover:text-white text-sm">Kanban</a>
    <a href="/ai" className="text-gray-400 hover:text-white text-sm">AI Tools</a>
    <a href="/analytics" className="text-gray-400 hover:text-white text-sm">Analytics</a>
    <a href="/search" className="text-gray-400 hover:text-white text-sm">Job Search</a>
    <button
      onClick={() => setShowForm(!showForm)}
      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
    >
      + Add Job
    </button>
    <button
      onClick={logout}
      className="text-gray-400 hover:text-white text-sm transition"
    >
      Logout
    </button>
  </div>
</nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Add Job Form */}
        {showForm && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
            <h2 className="text-white font-semibold text-lg mb-4">
              Add New Application
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">
                  Company
                </label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                  placeholder="Google"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">
                  Role
                </label>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                  placeholder="Software Engineer"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-1 block">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
              >
                <option>Applied</option>
                <option>Interviewing</option>
                <option>Offered</option>
                <option>Rejected</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="text-gray-400 text-sm mb-1 block">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                placeholder="Applied through LinkedIn..."
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={addJob}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition"
              >
                Save
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white px-6 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {['Applied', 'Interviewing', 'Offered', 'Rejected'].map((s) => (
            <div
              key={s}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4"
            >
              <div className="text-2xl font-bold text-white">
                {jobs.filter((j) => j.status === s).length}
              </div>
              <div className="text-gray-400 text-sm">{s}</div>
            </div>
          ))}
        </div>

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No applications yet</p>
            <p className="text-gray-600 text-sm mt-2">
              Click "+ Add Job" to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-white font-semibold">{job.company}</h3>
                  <p className="text-gray-400 text-sm">{job.role}</p>
                  {job.notes && (
                    <p className="text-gray-600 text-xs mt-1">{job.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full border ${statusColors[job.status]}`}
                  >
                    {job.status}
                  </span>
                  <span className="text-gray-600 text-xs">
                    {new Date(job.appliedDate).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => deleteJob(job.id)}
                    className="text-gray-600 hover:text-red-400 text-sm transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}