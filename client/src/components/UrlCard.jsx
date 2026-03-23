import { useState } from 'react';
import toast from 'react-hot-toast';
import { Copy, Trash2, BarChart2, ExternalLink, Calendar, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from '../utils/api';

export default function UrlCard({ url, onDelete }) {
  const [showQR, setShowQR] = useState(false);
  const shortUrl = `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/${url.shortCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Link copied to clipboard!');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        await api.delete(`/urls/${url._id}`);
        toast.success('Link deleted');
        onDelete();
      } catch (err) {
        toast.error('Failed to delete link');
      }
    }
  };

  return (
    <div className="glass card animate-entrance" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ maxWidth: '80%' }}>
          <h4 className="text-gradient" style={{ fontSize: '1.2rem', marginBottom: '0.3rem', wordBreak: 'break-all' }}>
            /{url.shortCode}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {url.originalUrl}
          </p>
        </div>
        <div className="badge">
          {url.clickCount} clicks
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
        <button onClick={copyToClipboard} className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', justifyContent: 'center' }} title="Copy Link">
          <Copy size={16} />
        </button>
        <button onClick={() => setShowQR(!showQR)} className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', justifyContent: 'center' }} title="QR Code">
          <QrCode size={16} />
        </button>
        <Link to={`/analytics/${url._id}`} className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', justifyContent: 'center' }} title="Analytics">
          <BarChart2 size={16} />
        </Link>
        <button onClick={handleDelete} className="btn" style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', justifyContent: 'center' }} title="Delete">
          <Trash2 size={16} />
        </button>
      </div>

      {url.expiresAt && (
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Calendar size={14} /> Expires: {new Date(url.expiresAt).toLocaleDateString()}
        </div>
      )}

      {showQR && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '0.5rem', display: 'flex', justifyContent: 'center' }}>
          <QRCodeSVG value={shortUrl} size={150} />
        </div>
      )}
    </div>
  );
}
