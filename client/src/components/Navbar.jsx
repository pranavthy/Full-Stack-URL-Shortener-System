import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link2, LogOut, BarChart3, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass" style={{ margin: '1rem auto', maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1.5rem', zIndex: 100, padding: '1rem 2rem' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontWeight: 800, fontSize: '1.4rem' }}>
        <Link2 className="text-primary" style={{ color: 'var(--primary)' }} /> <span className="text-gradient">LinkSwift</span>
      </Link>
      
      {user ? (
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/dashboard" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Hi, {user.name}</span>
          <button onClick={handleLogout} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.5rem 1rem' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" className="btn" style={{ color: 'white' }}>Login</Link>
          <Link to="/signup" className="btn btn-primary">Sign Up</Link>
        </div>
      )}
    </nav>
  );
}
