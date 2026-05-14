'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const STATUSES = ['Applied', 'Interviewing', 'Offered', 'Rejected'];

const statusColors: Record<string, string> = {
  Applied: 'border-blue-500/30 bg-blue-500/5',
  Interviewing: 'border-amber-500/30 bg-amber-500/5',
  Offered: 'border-green-500/30 bg-green-500/5',
  Rejected: 'border-red-500/30 bg-red-500/5',
};

const statusBadgeColors: Record<string, string> = {
  Applied: 'bg-blue-500/10 text-blue-400',
  Interviewing: 'bg-amber-500/10 text-amber-400',
  Offered: 'bg-green-500/10 text-green-400',
  Rejected: 'bg-red-500/10 text-red-400',
};

const statusHeaderColors: Record<string, string> = {
  Applied: 'text-blue-400',
  Interviewing: 'text-amber-400',
  Offered: 'text-green-400',
  Rejected: 'text-red-400',
};

export default function KanbanPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;
    const jobId = parseInt(draggableId);

    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );

    try {
      const token = localStorage.getItem('token');
      await fetch(`https://ai-job-tracker-production-fd21.up.railway.app/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getJobsByStatus = (status: string) =>
    jobs.filter((job) => job.status === status);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-white font-bold text-xl">AI Job Tracker</h1>
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-gray-400 hover:text-white text-sm transition">
            Dashboard
          </a>
          <a href="/kanban" className="text-purple-400 text-sm font-medium">
            Kanban
          </a>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/login');
            }}
            className="text-gray-400 hover:text-white text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="px-6 py-8">
        <div className="mb-6">
          <h2 className="text-white text-2xl font-bold">Kanban Board</h2>
          <p className="text-gray-400 text-sm mt-1">
            Drag and drop cards to update application status
          </p>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-4 gap-4">
            {STATUSES.map((status) => (
              <div key={status} className="flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-semibold text-sm ${statusHeaderColors[status]}`}>
                    {status}
                  </h3>
                  <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">
                    {getJobsByStatus(status).length}
                  </span>
                </div>

                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 min-h-48 rounded-xl border p-3 transition-colors ${statusColors[status]} ${snapshot.isDraggingOver ? 'border-purple-500/50' : ''}`}
                    >
                      {getJobsByStatus(status).map((job, index) => (
                        <Draggable
                          key={job.id}
                          draggableId={String(job.id)}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-gray-900 border border-gray-700 rounded-lg p-3 mb-2 cursor-grab active:cursor-grabbing transition-shadow ${snapshot.isDragging ? 'shadow-lg shadow-purple-500/20 border-purple-500/30' : ''}`}
                            >
                              <h4 className="text-white font-medium text-sm">
                                {job.company}
                              </h4>
                              <p className="text-gray-400 text-xs mt-0.5">
                                {job.role}
                              </p>
                              {job.notes && (
                                <p className="text-gray-600 text-xs mt-1 truncate">
                                  {job.notes}
                                </p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadgeColors[status]}`}>
                                  {status}
                                </span>
                                <span className="text-gray-600 text-xs">
                                  {new Date(job.appliedDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}