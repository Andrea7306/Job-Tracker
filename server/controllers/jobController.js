import Job from '../models/Job.js';

// GET /api/jobs — all jobs for logged-in user
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/jobs — create job
export const createJob = async (req, res) => {
  const { company, role, status, jobUrl, description, appliedAt, deadline, notes } = req.body;

  try {
    const job = await Job.create({
      user: req.user._id,
      company, role, status, jobUrl, description, appliedAt, deadline, notes,
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/jobs/:id — update job (also used for Kanban drag status change)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    Object.assign(job, req.body);
    const updated = await job.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
