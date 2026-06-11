import { useState } from 'react';
import api from '../api/axios';

export default function CoverLetterModal({ job, onClose }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [copied, setCopied]           = useState(false);

  const generate = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/ai/cover-letter', {
        company:     job.company,
        role:        job.role,
        description: job.description || '',
      });
      setCoverLetter(data.coverLetter);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate cover letter');
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto-generate on open
  useState(() => { generate(); }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Cover Letter</h2>
            <p className="text-xs text-gray-500 mt-0.5">{job.role} at {job.company}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
              <p className="text-sm text-gray-500">Gemini is writing your cover letter…</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
              <button onClick={generate} className="ml-2 underline">Try again</button>
            </div>
          )}

          {coverLetter && !loading && (
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap border border-gray-100">
              {coverLetter}
            </div>
          )}
        </div>

        {/* Footer */}
        {coverLetter && !loading && (
          <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
            <button
              onClick={generate}
              className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Regenerate
            </button>
            <button
              onClick={copy}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {copied ? '✓ Copied!' : 'Copy to clipboard'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}