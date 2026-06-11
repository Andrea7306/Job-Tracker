import { useState, useEffect } from 'react';
import api from '../api/axios';

export const useJobs = () => {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/jobs');
      setJobs(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const addJob = async (jobData) => {
    const { data } = await api.post('/jobs', jobData);
    setJobs((prev) => [data, ...prev]);
    return data;
  };

  const updateJob = async (id, jobData) => {
    const { data } = await api.put(`/jobs/${id}`, jobData);
    setJobs((prev) => prev.map((j) => (j._id === id ? data : j)));
    return data;
  };

  const deleteJob = async (id) => {
    await api.delete(`/jobs/${id}`);
    setJobs((prev) => prev.filter((j) => j._id !== id));
  };

  // Used by Kanban drag-and-drop to update status
  const updateStatus = async (id, status) => {
    return updateJob(id, { status });
  };

  return { jobs, loading, error, addJob, updateJob, deleteJob, updateStatus, refetch: fetchJobs };
};
