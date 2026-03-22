import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Plus, Link as LinkIcon, Search } from 'lucide-react';
import UrlCard from '../components/UrlCard';

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [iosUrl, setIosUrl] = useState('');
  const [androidUrl, setAndroidUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUrls = async () => {
    try {
      const res = await api.get('/urls');
      setUrls(res.data);
    } catch (err) {
      toast.error('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/urls', { originalUrl: longUrl, customAlias, expiresAt, iosUrl, androidUrl });
      toast.success('URL shortened successfully');
      setLongUrl('');
      setCustomAlias('');
      setExpiresAt('');
      setIosUrl('');
      setAndroidUrl('');
      fetchUrls();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to shorten URL');
    }
  };

  const filteredUrls = urls.filter(url => {
    const search = searchTerm.toLowerCase();
    const originalUrl = (url.originalUrl || '').toLowerCase();
    const customAlias = (url.customAlias || '').toLowerCase();
    const shortCode = (url.shortCode || '').toLowerCase();
    
    return originalUrl.includes(search) || 
           customAlias.includes(search) || 
           shortCode.includes(search);
  });

  return (
    <div className="container">
      <div className="glass card animate-entrance" style={{ marginBottom: '2.5rem', animationDelay: '0.1s' }}>
        <h3 className="text-gradient" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>✨ Shorten a New URL</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Long URL</label>
              <input 
                type="url" placeholder="https://example.com/very/long/url" className="input" 
                style={{ marginBottom: 0 }} required value={longUrl} onChange={e => setLongUrl(e.target.value)} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Custom Alias (Optional)</label>
              <input 
                type="text" placeholder="my-cool-link" className="input" 
                style={{ marginBottom: 0 }} value={customAlias} onChange={e => setCustomAlias(e.target.value)} 
              />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>iOS Target URL (Optional)</label>
              <input 
                type="url" placeholder="https://apps.apple.com/..." className="input" 
                style={{ marginBottom: 0 }} value={iosUrl} onChange={e => setIosUrl(e.target.value)} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Android Target URL (Optional)</label>
              <input 
                type="url" placeholder="https://play.google.com/..." className="input" 
                style={{ marginBottom: 0 }} value={androidUrl} onChange={e => setAndroidUrl(e.target.value)} 
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Expiry Date (Optional)</label>
                <input 
                  type="date" className="input" 
                  style={{ marginBottom: 0 }} value={expiresAt} onChange={e => setExpiresAt(e.target.value)} 
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: '2.8rem', marginTop: '1.6rem' }}>
                <Plus size={20} /> Shorten
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="animate-entrance" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', animationDelay: '0.2s' }}>
        <h2>Your Shortened Links</h2>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', right: '0.75rem', top: '0.75rem', color: 'var(--text-muted)' }} />
          <input 
            type="text" placeholder="Search links..." className="input" 
            style={{ marginBottom: 0, width: '250px', paddingRight: '2.5rem' }} 
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading your links...</p>
      ) : filteredUrls.length === 0 ? (
        <div className="glass card" style={{ textAlign: 'center', padding: '4rem' }}>
          <LinkIcon size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <p>{searchTerm ? 'No links match your search.' : "You haven't shortened any URLs yet."}</p>
        </div>
      ) : (
        <div className="grid">
          {filteredUrls.map(url => (
            <UrlCard key={url._id} url={url} onDelete={fetchUrls} />
          ))}
        </div>
      )}
    </div>
  );
}
