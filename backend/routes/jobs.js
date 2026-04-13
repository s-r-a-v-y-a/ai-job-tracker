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

module.exports = router;