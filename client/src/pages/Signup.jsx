import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '10vh' }}>
      <div className="glass card">
        <h2 style={{ textAlign: 'center' }}>Join LinkSwift</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" placeholder="Full Name" className="input" required 
            value={name} onChange={e => setName(e.target.value)} 
          />
          <input 
            type="email" placeholder="Email" className="input" required 
            value={email} onChange={e => setEmail(e.target.value)} 
          />
          <input 
            type="password" placeholder="Password" className="input" required 
            value={password} onChange={e => setPassword(e.target.value)} 
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <UserPlus size={20} /> Sign Up
          </button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
