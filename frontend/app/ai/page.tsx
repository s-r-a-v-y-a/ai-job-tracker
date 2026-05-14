'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Tab = 'score' | 'cover' | 'interview' | 'match';

export default function AIPage() {
  const [activeTab, setActiveTab] = useState<Tab>('score');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Resume Scorer
  const [resumeText, setResumeText] = useState('');
  const [scoreResult, setScoreResult] = useState<any>(null);

  // Cover Letter
  const [coverResume, setCoverResume] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  // Interview Prep
  const [interviewTitle, setInterviewTitle] = useState('');
  const [interviewDesc, setInterviewDesc] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [openQ, setOpenQ] = useState<number | null>(null);

  // Match
  const [matchResume, setMatchResume] = useState('');
  const [matchJob, setMatchJob] = useState('');
  const [matchResult, setMatchResult] = useState<any>(null);

  const token = () => localStorage.getItem('token');

  const scoreResume = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/ai/score-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ resumeText }),
      });
      const data = await res.json();
      setScoreResult(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const generateCoverLetter = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ resumeText: coverResume, jobTitle, company, jobDescription: jobDesc }),
      });
      const data = await res.json();
      setCoverLetter(data.coverLetter);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const generateInterviewPrep = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/ai/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ jobTitle: interviewTitle, jobDescription: interviewDesc }),
      });
      const data = await res.json();
      setQuestions(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const matchResumeFn = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ resumeText: matchResume, jobDescription: matchJob }),
      });
      const data = await res.json();
      setMatchResult(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const tabs = [
    { id: 'score', label: '📊 Resume Score' },
    { id: 'cover', label: '✉️ Cover Letter' },
    { id: 'interview', label: '🎯 Interview Prep' },
    { id: 'match', label: '🔍 Job Match' },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-white font-bold text-xl">AI Job Tracker</h1>
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-gray-400 hover:text-white text-sm transition">Dashboard</a>
          <a href="/kanban" className="text-gray-400 hover:text-white text-sm transition">Kanban</a>
          <a href="/ai" className="text-purple-400 text-sm font-medium">AI Tools</a>
          <button onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}
            className="text-gray-400 hover:text-white text-sm transition">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-white text-2xl font-bold">AI Tools</h2>
          <p className="text-gray-400 text-sm mt-1">Powered by Google Gemini</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)}
              className={`px-4 py-3 text-sm font-medium transition border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* RESUME SCORER */}
        {activeTab === 'score' && (
          <div>
            <p className="text-gray-400 text-sm mb-4">Paste your resume text below to get an ATS score and improvement tips.</p>
            <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)}
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
              placeholder="Paste your resume text here..." rows={8} />
            <button onClick={scoreResume} disabled={loading || !resumeText}
              className="mt-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition">
              {loading ? 'Analyzing...' : 'Score My Resume'}
            </button>

            {scoreResult && (
              <div className="mt-6 space-y-4">
                {/* Score Circle */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-6">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${
                    scoreResult.score >= 70 ? 'border-green-500' : scoreResult.score >= 50 ? 'border-amber-500' : 'border-red-500'
                  }`}>
                    <span className="text-white text-2xl font-bold">{scoreResult.score}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">ATS Score</p>
                    <p className="text-gray-400 text-sm">{scoreResult.summary}</p>
                  </div>
                </div>

                {/* Strengths */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h3 className="text-green-400 font-semibold mb-3">✓ Strengths</h3>
                  <ul className="space-y-2">
                    {scoreResult.strengths?.map((s: string, i: number) => (
                      <li key={i} className="text-gray-300 text-sm flex gap-2">
                        <span className="text-green-400">•</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h3 className="text-amber-400 font-semibold mb-3">⚡ Improvements</h3>
                  <ul className="space-y-2">
                    {scoreResult.improvements?.map((s: string, i: number) => (
                      <li key={i} className="text-gray-300 text-sm flex gap-2">
                        <span className="text-amber-400">•</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* COVER LETTER */}
        {activeTab === 'cover' && (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">Fill in the details below to generate a tailored cover letter.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Job Title</label>
                <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                  placeholder="Software Engineer" />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Company</label>
                <input value={company} onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                  placeholder="Google" />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Job Description</label>
              <textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)}
                className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
                placeholder="Paste the job description here..." rows={4} />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Your Resume</label>
              <textarea value={coverResume} onChange={(e) => setCoverResume(e.target.value)}
                className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
                placeholder="Paste your resume text here..." rows={4} />
            </div>
            <button onClick={generateCoverLetter} disabled={loading || !jobTitle || !company}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition">
              {loading ? 'Generating...' : 'Generate Cover Letter'}
            </button>

            {coverLetter && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Generated Cover Letter</h3>
                  <button onClick={() => navigator.clipboard.writeText(coverLetter)}
                    className="text-purple-400 text-sm hover:text-purple-300">Copy</button>
                </div>
                <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{coverLetter}</p>
              </div>
            )}
          </div>
        )}

        {/* INTERVIEW PREP */}
        {activeTab === 'interview' && (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">Get AI-generated interview questions and model answers.</p>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Job Title</label>
              <input value={interviewTitle} onChange={(e) => setInterviewTitle(e.target.value)}
                className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                placeholder="Software Engineer" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Job Description (optional)</label>
              <textarea value={interviewDesc} onChange={(e) => setInterviewDesc(e.target.value)}
                className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
                placeholder="Paste the job description for more specific questions..." rows={4} />
            </div>
            <button onClick={generateInterviewPrep} disabled={loading || !interviewTitle}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition">
              {loading ? 'Generating...' : 'Generate Questions'}
            </button>

            {questions.length > 0 && (
              <div className="space-y-3 mt-4">
                {questions.map((q: any, i: number) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <button onClick={() => setOpenQ(openQ === i ? null : i)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between">
                      <span className="text-white text-sm font-medium">
                        <span className="text-purple-400 mr-2">Q{i + 1}.</span>{q.question}
                      </span>
                      <span className="text-gray-400">{openQ === i ? '▲' : '▼'}</span>
                    </button>
                    {openQ === i && (
                      <div className="px-5 pb-4 border-t border-gray-800">
                        <p className="text-gray-300 text-sm leading-relaxed mt-3">{q.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* JOB MATCH */}
        {activeTab === 'match' && (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">See how well your resume matches a job description.</p>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Your Resume</label>
              <textarea value={matchResume} onChange={(e) => setMatchResume(e.target.value)}
                className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
                placeholder="Paste your resume text here..." rows={5} />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Job Description</label>
              <textarea value={matchJob} onChange={(e) => setMatchJob(e.target.value)}
                className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
                placeholder="Paste the job description here..." rows={5} />
            </div>
            <button onClick={matchResumeFn} disabled={loading || !matchResume || !matchJob}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition">
              {loading ? 'Analyzing...' : 'Analyze Match'}
            </button>

            {matchResult && (
              <div className="space-y-4 mt-4">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-6">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${
                    matchResult.matchScore >= 70 ? 'border-green-500' : matchResult.matchScore >= 50 ? 'border-amber-500' : 'border-red-500'
                  }`}>
                    <span className="text-white text-2xl font-bold">{matchResult.matchScore}%</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">Match Score</p>
                    <p className="text-gray-400 text-sm">{matchResult.topSuggestion}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                    <h3 className="text-green-400 font-semibold mb-3">✓ Matched Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.matchedKeywords?.map((k: string, i: number) => (
                        <span key={i} className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded-full">{k}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                    <h3 className="text-red-400 font-semibold mb-3">✗ Missing Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.missingKeywords?.map((k: string, i: number) => (
                        <span key={i} className="bg-red-500/10 text-red-400 text-xs px-2 py-1 rounded-full">{k}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}