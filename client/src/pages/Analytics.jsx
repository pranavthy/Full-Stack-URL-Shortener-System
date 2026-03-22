import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Clock, Globe, MousePointer2 } from 'lucide-react';

export default function Analytics() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [dailyStats, setDailyStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resStats, resDaily] = await Promise.all([
          api.get(`/analytics/${id}`),
          api.get(`/analytics/${id}/daily`)
        ]);
        setData(resStats.data);
        setDailyStats(resDaily.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="container">Loading analytics...</div>;
  if (!data) return <div className="container">No data found for this link.</div>;

  return (
    <div className="container">
      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass card" style={{ textAlign: 'center' }}>
          <MousePointer2 size={24} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Clicks</p>
          <h2 style={{ marginBottom: 0 }}>{data.totalClicks}</h2>
        </div>
        <div className="glass card" style={{ textAlign: 'center' }}>
          <Clock size={24} style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Last Visit</p>
          <h4 style={{ marginBottom: 0 }}>{data.lastVisit ? new Date(data.lastVisit).toLocaleString() : 'Never'}</h4>
        </div>
        <div className="glass card" style={{ textAlign: 'center' }}>
          <Globe size={24} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Visits (History)</p>
          <h4 style={{ marginBottom: 0 }}>{data.recentHistory.length}</h4>
        </div>
      </div>

      <div className="glass card" style={{ marginBottom: '2rem' }}>
        <h3>Daily Click Trends</h3>
        <div style={{ height: '300px', marginTop: '1rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyStats}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="_id" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="count" stroke="var(--primary)" fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass card">
        <h3>Recent Visits</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Timestamp</th>
              <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>IP Address</th>
              <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>User Agent</th>
            </tr>
          </thead>
          <tbody>
            {data.recentHistory.map((click, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>{new Date(click.timestamp).toLocaleString()}</td>
                <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>{click.ip}</td>
                <td style={{ padding: '0.75rem', fontSize: '0.85rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{click.userAgent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
