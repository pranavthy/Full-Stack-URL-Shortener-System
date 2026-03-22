import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { KeyRound } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    setLoading(true);
    try {
      const res = await api.put(`/auth/resetpassword/${token}`, { password });
      toast.success(res.data.message || 'Password updated successfully');
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '10vh' }}>
      <div className="glass card">
        <h2 style={{ textAlign: 'center' }}>Reset Password</h2>
        
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
              Your password has been successfully reset!
            </div>
            <p style={{ color: 'var(--text-muted)' }}>Redirecting to login...</p>
            <Link to="/login" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
              Go to Login Now
            </Link>
          </div>
        ) : (
          <>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Please enter your new password below.
            </p>
            <form onSubmit={handleSubmit}>
              <input 
                type="password" 
                placeholder="New Password" 
                className="input" 
                required 
                minLength="6"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
              <input 
                type="password" 
                placeholder="Confirm New Password" 
                className="input" 
                required 
                minLength="6"
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
              />
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={loading}
              >
                <KeyRound size={20} /> {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
