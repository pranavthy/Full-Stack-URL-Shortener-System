require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(helmet({ contentSecurityPolicy: false })); // Disable CSP for easier development
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/urls', require('./routes/urls'));
app.use('/api/analytics', require('./routes/analytics'));

const User = require('./models/User');
const Url = require('./models/Url');
const Click = require('./models/Click');

// Backend Data Viewer Page (Only for development/hackathon demonstration)
app.get('/admin/data', async (req, res) => {
  try {
    const users = await User.find().lean();
    const urls = await Url.find().lean();
    const clicks = await Click.find().sort({ timestamp: -1 }).limit(50).lean();

    let html = `
      <html>
        <head>
          <title>LinkSwift Database Viewer</title>
          <style>
            body { font-family: system-ui; padding: 20px; background: #f8fafc; color: #1e293b; }
            h1 { color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
            h2 { margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
            th { background: #f1f5f9; }
            .badge { background: #e2e8f0; padding: 3px 8px; border-radius: 12px; font-size: 0.85em; }
          </style>
        </head>
        <body>
          <h1>📦 LinkSwift Live Database Records</h1>
          <p>Showing raw data currently stored in your MongoDB Atlas Cluster.</p>

          <h2>👥 Users (${users.length})</h2>
          <table>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Created</th></tr>
            ${users.map(u => `<tr><td>${u._id}</td><td>${u.name}</td><td>${u.email}</td><td>${new Date(u.createdAt).toLocaleString()}</td></tr>`).join('')}
          </table>

          <h2>🔗 Shortened URLs (${urls.length})</h2>
          <table>
            <tr><th>Original URL</th><th>Short Code</th><th>iOS Route</th><th>Android Route</th><th>Clicks</th><th>Creator ID</th></tr>
            ${urls.map(u => `<tr><td><div style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${u.originalUrl}</div></td><td><strong style="color:#ef4444;">${u.shortCode}</strong></td><td>${u.iosUrl || '-'}</td><td>${u.androidUrl || '-'}</td><td><span class="badge">${u.clickCount}</span></td><td><small>${u.userId}</small></td></tr>`).join('')}
          </table>

          <h2>🖱️ Recent Clicks Logs (Last 50)</h2>
          <table>
            <tr><th>URL ID</th><th>Time</th><th>User Agent / Device</th><th>IP Address</th></tr>
            ${clicks.map(c => `<tr><td><small>${c.urlId}</small></td><td>${new Date(c.timestamp).toLocaleString()}</td><td>${c.userAgent || 'Unknown'}</td><td>${c.ip || 'Local'}</td></tr>`).join('')}
          </table>
          
          <br><br>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="display: inline-block; padding: 10px 20px; background: #6366f1; color: white; text-decoration: none; border-radius: 5px;">Back to Frontend</a>
        </body>
      </html>
    `;
    res.send(html);
  } catch (err) {
    res.status(500).send("Error reading database: " + err.message);
  }
});

// Root endpoint for backend healthcheck/welcome
app.get('/', (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.send(`
    <html>
      <head><title>LinkSwift API Configuration</title></head>
      <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 100px; padding: 20px;">
        <h1 style="color: #4f46e5;">LinkSwift Core API is Online 🚀</h1>
        <p style="font-size: 1.2rem; color: #555;">Your NodeJS/Express backend server is successfully connected to MongoDB and routing traffic.</p>
        <a href="/admin/data" style="display: inline-block; padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; margin-right: 10px;">View Database Records</a>
        <a href="${frontendUrl}" style="display: inline-block; padding: 10px 20px; background: #6366f1; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">Return to Frontend Dashboard</a>
      </body>
    </html>
  `);
});

app.use('/', require('./routes/redirect'));

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/url_shortener';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
