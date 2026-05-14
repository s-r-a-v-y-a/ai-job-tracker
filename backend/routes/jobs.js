const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();


// GET all jobs for logged in user
router.get('/', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { userId: req.userId }
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// CREATE a new job
router.post('/', async (req, res) => {
  try {
    const { company, role, status, notes } = req.body;
    const job = await prisma.job.create({
      data: {
        company,
        role,
        status: status || 'Applied',
        notes,
        userId: req.userId
      }
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// UPDATE a job
router.patch('/:id', async (req, res) => {
  try {
    const { company, role, status, notes } = req.body;
    const job = await prisma.job.update({
      where: {
        id: parseInt(req.params.id),
        userId: req.userId
      },
      data: { company, role, status, notes }
    });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// DELETE a job
router.delete('/:id', async (req, res) => {
  try {
    await prisma.job.delete({
      where: {
        id: parseInt(req.params.id),
        userId: req.userId
      }
    });
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ANALYTICS
router.get('/analytics', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { userId: req.userId }
    });

    const total = jobs.length;
    const byStatus = {
      Applied: jobs.filter(j => j.status === 'Applied').length,
      Interviewing: jobs.filter(j => j.status === 'Interviewing').length,
      Offered: jobs.filter(j => j.status === 'Offered').length,
      Rejected: jobs.filter(j => j.status === 'Rejected').length,
    };

    const responseRate = total > 0
      ? Math.round((byStatus.Interviewing + byStatus.Offered) / total * 100)
      : 0;

    // Group by month
    const byMonth = {};
    jobs.forEach(job => {
      const month = new Date(job.appliedDate).toLocaleString('default', { month: 'short' });
      byMonth[month] = (byMonth[month] || 0) + 1;
    });

    const timeline = Object.entries(byMonth).map(([month, count]) => ({ month, count }));

    const funnel = [
      { stage: 'Applied', count: total },
      { stage: 'Interviewing', count: byStatus.Interviewing + byStatus.Offered },
      { stage: 'Offered', count: byStatus.Offered },
    ];

    res.json({
      total,
      byStatus,
      responseRate,
      timeline,
      funnel,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;