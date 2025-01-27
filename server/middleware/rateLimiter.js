const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutit
    max: 100 // max 100 päringut IP kohta
});

module.exports = limiter; 