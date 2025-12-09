// middleware/cors.js
// CORS middleware to allow frontend (file:/// protocol or localhost) to communicate with backend

function corsMiddleware(req, res, next) {
    const origin = req.headers.origin;

    // Allow file:/// protocol (null origin) and localhost
    if (!origin || origin === 'null' || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Role, X-Session-ID');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    next();
}

module.exports = corsMiddleware;
