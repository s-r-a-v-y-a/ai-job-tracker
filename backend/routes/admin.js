const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

// Admin middleware
const adminOnly = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// GET all users with their job counts
router.get('/users', adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { jobs: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET platform stats
router.get('/stats', adminOnly, async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalJobs = await prisma.job.count();
    const jobsByStatus = await prisma.job.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    res.json({
      totalUsers,
      totalJobs,
      jobsByStatus: jobsByStatus.map(j => ({
        status: j.status,
        count: j._count.status
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Make a user admin
router.patch('/users/:id/role', adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { role }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

module.exports = router;