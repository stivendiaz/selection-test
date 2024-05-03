import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: 'You have exceeded your 15 requests per minute limit.',
  headers: true,
});

export default limiter;
