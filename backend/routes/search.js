const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { q, location } = req.query;
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=10&what=${encodeURIComponent(q || 'software engineer')}&where=${encodeURIComponent(location || 'united states')}&content-type=application/json`;

    const response = await fetch(url);
    const data = await response.json();

    const jobs = data.results?.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company?.display_name || 'Unknown',
      location: job.location?.display_name || 'Unknown',
      salary: job.salary_min
        ? `$${Math.round(job.salary_min / 1000)}k - $${Math.round(job.salary_max / 1000)}k`
        : 'Not specified',
      description: job.description?.slice(0, 200) + '...',
      url: job.redirect_url,
      posted: new Date(job.created).toLocaleDateString(),
    })) || [];

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to search jobs' });
  }
});

module.exports = router;