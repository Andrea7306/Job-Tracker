import { useState } from 'react';

export default function JobCard({ job, onEdit, onDelete, onCoverLetter }) {
  const [showMenu, setShowMenu] = useState(false);

  const deadlinePassed = job.deadline && new Date(job.deadline) < new Date();

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm hover:shadow-md transition-shadow relative">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{job.role}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{job.company}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-300 hover:text-gray-500 text-lg leading-none px-1"
          >
            ⋯
          </button>
          {showMenu && (
            <div className="absolute right-0 top-6 bg-white border border-gray-100 rounded-lg shadow-lg z-10 w-36 py-1">
              <button
                onClick={() => { onEdit(job); setShowMenu(false); }}
                className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => { onCoverLetter(job); setShowMenu(false); }}
                className="w-full text-left px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50"
              >
                ✨ Cover letter
              </button>
              <button
                onClick={() => { onDelete(job._id); setShowMenu(false); }}
                className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                🗑 Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {job.deadline && (
        <p className={`text-xs mt-1 ${deadlinePassed ? 'text-red-500' : 'text-gray-400'}`}>
          {deadlinePassed ? '⚠ ' : '📅 '}
          {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </p>
      )}

      {job.jobUrl && (
        <a
          href={job.jobUrl} target="_blank" rel="noreferrer"
          className="text-xs text-blue-500 hover:underline mt-1 block truncate"
        >
          View posting ↗
        </a>
      )}
    </div>
  );
}