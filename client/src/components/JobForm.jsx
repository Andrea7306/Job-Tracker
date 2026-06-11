import { useState } from 'react';

const STATUSES = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'];

export default function JobForm({ onClose, onSave, initialData = {} }) {
  const [form, setForm] = useState({
    company:     initialData.company     || '',
    role:        initialData.role        || '',
    status:      initialData.status      || 'Saved',
    jobUrl:      initialData.jobUrl      || '',
    description: initialData.description || '',
    notes:       initialData.notes       || '',
    deadline:    initialData.deadline    ? initialData.deadline.slice(0, 10) : '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  const field = (label, key, type = 'text', required = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {initialData._id ? 'Edit job' : 'Add new job'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
          )}

          {field('Company', 'company', 'text', true)}
          {field('Role / Position', 'role', 'text', true)}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {field('Job URL', 'jobUrl')}
          {field('Application deadline', 'deadline', 'date')}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job description <span className="text-gray-400 font-normal">(used for AI cover letter)</span>
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Paste the job description here..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any notes about this application..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving…' : initialData._id ? 'Save changes' : 'Add job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}