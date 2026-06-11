import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Navbar from '../components/Navbar';
import JobCard from '../components/JobCard';
import JobForm from '../components/JobForm';
import CoverLetterModal from '../components/CoverLetterModal';
import { useJobs } from '../hooks/useJobs';

const COLUMNS = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'];

const COLUMN_COLORS = {
  Saved:     'bg-gray-100 text-gray-700',
  Applied:   'bg-blue-100 text-blue-700',
  Interview: 'bg-yellow-100 text-yellow-700',
  Offer:     'bg-green-100 text-green-700',
  Rejected:  'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const { jobs, loading, addJob, updateJob, deleteJob, updateStatus } = useJobs();
  const [showForm, setShowForm]             = useState(false);
  const [editJob, setEditJob]               = useState(null);
  const [coverLetterJob, setCoverLetterJob] = useState(null);

  const byStatus = (status) => jobs.filter((j) => j.status === status);

  const handleSave = async (formData) => {
    if (editJob?._id) {
      await updateJob(editJob._id, formData);
    } else {
      await addJob(formData);
    }
  };

  const handleEdit = (job) => {
    setEditJob(job);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditJob(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this job?')) {
      await deleteJob(id);
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a column
    if (!destination) return;

    // Dropped in same column same position
    if (destination.droppableId === source.droppableId) return;

    // Update status in DB
    await updateStatus(draggableId, destination.droppableId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Applications</h1>
            <p className="text-sm text-gray-500 mt-0.5">{jobs.length} job{jobs.length !== 1 ? 's' : ''} tracked</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Job
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {COLUMNS.map((col) => (
            <div key={col} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <p className="text-2xl font-semibold text-gray-900">{byStatus(col).length}</p>
              <p className="text-xs text-gray-500 mt-1">{col}</p>
            </div>
          ))}
        </div>

        {/* Kanban with drag and drop */}
        {loading ? (
          <p className="text-center text-gray-400 py-20">Loading your jobs…</p>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {COLUMNS.map((col) => (
                <div key={col} className="bg-white rounded-xl border border-gray-100 p-4">
                  {/* Column header */}
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-medium text-gray-700">{col}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${COLUMN_COLORS[col]}`}>
                      {byStatus(col).length}
                    </span>
                  </div>

                  {/* Droppable area */}
                  <Droppable droppableId={col}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-2 min-h-[60px] rounded-lg transition-colors ${
                          snapshot.isDraggingOver ? 'bg-blue-50' : ''
                        }`}
                      >
                        {byStatus(col).map((job, index) => (
                          <Draggable key={job._id} draggableId={job._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`${snapshot.isDragging ? 'opacity-80 rotate-1 shadow-lg' : ''}`}
                              >
                                <JobCard
                                  job={job}
                                  onEdit={handleEdit}
                                  onDelete={handleDelete}
                                  onCoverLetter={setCoverLetterJob}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {byStatus(col).length === 0 && !snapshot.isDraggingOver && (
                          <p className="text-xs text-gray-300 text-center py-6">Empty</p>
                        )}
                      </div>
                    )}
                  </Droppable>

                  <button
                    onClick={() => { setEditJob({ status: col }); setShowForm(true); }}
                    className="w-full mt-3 text-xs text-gray-400 hover:text-blue-500 hover:bg-blue-50 py-1.5 rounded-lg transition-colors"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </DragDropContext>
        )}
      </div>

      {showForm && (
        <JobForm onClose={handleClose} onSave={handleSave} initialData={editJob || {}} />
      )}

      {coverLetterJob && (
        <CoverLetterModal job={coverLetterJob} onClose={() => setCoverLetterJob(null)} />
      )}
    </div>
  );
}