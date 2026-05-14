'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const router = useRouter();

  const searchJobs = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:3001/api/search?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveJob = async (job: any) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3001/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company: job.company,
          role: job.title,
          status: 'Applied',
          notes: `Found on Adzuna. Location: ${job.location}. Salary: ${job.salary}`,
        }),
      });
      alert(`Saved "${job.title}" at ${job.company} to your tracker!`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-white font-bold text-xl">AI Job Tracker</h1>
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-gray-400 hover:text-white text-sm">Dashboard</a>
          <a href="/kanban" className="text-gray-400 hover:text-white text-sm">Kanban</a>
          <a href="/ai" className="text-gray-400 hover:text-white text-sm">AI Tools</a>
          <a href="/analytics" className="text-gray-400 hover:text-white text-sm">Analytics</a>
          <a href="/search" className="text-purple-400 text-sm font-medium">Job Search</a>
          <button
            onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}
            className="text-gray-400 hover:text-white text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-white text-2xl font-bold">Job Search</h2>
          <p className="text-gray-400 text-sm mt-1">Search real jobs and save them to your tracker instantly</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Job Title</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchJobs()}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchJobs()}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                placeholder="New York"
              />
            </div>
          </div>
          <button
            onClick={searchJobs}
            disabled={loading || !query}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            {loading ? 'Searching...' : 'Search Jobs'}
          </button>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">Searching jobs...</p>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No jobs found. Try a different search.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">{results.length} jobs found</p>
            {results.map((job) => (
              <div key={job.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{job.title}</h3>
                    <p className="text-purple-400 text-sm mt-0.5">{job.company}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-gray-400 text-xs">📍 {job.location}</span>
                      <span className="text-gray-400 text-xs">💰 {job.salary}</span>
                      <span className="text-gray-400 text-xs">📅 {job.posted}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-2 leading-relaxed">{job.description}</p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => saveJob(job)}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-2 rounded-lg transition"
                    >
                      + Save to Tracker
                    </button>
                    <button
                      onClick={() => window.open(job.url, '_blank')}
                      className="border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white text-xs px-3 py-2 rounded-lg transition"
                    >
                      View Job
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}