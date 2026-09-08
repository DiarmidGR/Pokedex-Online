const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const client = require('./redis.config');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
    message: { error: 'Too many requests, please try again later.' },

	// Redis store configuration
	store: new RedisStore({
		sendCommand: (...args) => client.sendCommand(args),
	}),
})

module.exports = limiter;
