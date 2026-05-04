'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { api, auth, guid } from '@/lib/api';

function Field({
  id, type = 'text', placeholder, value, onChange, msg, msgType
}: {
  id: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void;
  msg: string; msgType: 'ok' | 'error' | '';
}) {
  return (
    <div className="field">
      <input
        id={id} type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        className={msgType === 'ok' ? 'input-ok' : msgType === 'error' ? 'input-error' : ''}
      />
      {msg && <span className={`msg ${msgType}`}>{msg}</span>}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; msg: string } | null>(null);
  const [fields, setFields] = useState({
    username: { msg: '', type: '' as 'ok' | 'error' | '' },
    password: { msg: '', type: '' as 'ok' | 'error' | '' }
  });
  const [loading, setLoading] = useState(false);

  function setField(field: 'username' | 'password', ok: boolean, msg: string) {
    setFields(f => ({ ...f, [field]: { msg, type: ok ? 'ok' : 'error' } }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    let valid = true;

    if (!username) { setField('username', false, 'Username is required.'); valid = false; }
    else setField('username', true, 'Good');

    if (!password) { setField('password', false, 'Password is required.'); valid = false; }
    else setField('password', true, 'Good');

    if (!valid) return;

    setLoading(true);
    try {
      const res = await api.login(username, password);
      if (res.success) {
        auth.setToken(guid());
        auth.setUsername(res.user.username);
        auth.setUsertype(res.user.usertype || 'user');
        setAlert({ type: 'success', msg: `Welcome back, ${res.user.username}! Redirecting...` });
        setTimeout(() => router.push('/home'), 1000);
      } else {
        setAlert({ type: 'error', msg: res.message });
      }
    } catch {
      setAlert({ type: 'error', msg: 'Server error. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar rightContent={<Link href="/sign-up" className="btn">Sign Up</Link>} />
      <div className="wrap-container">
        <div className="card">
          <h2>Welcome Back</h2>
          <p>Login to your account</p>

          {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <Field id="loginUsername" placeholder="Username" value={username} onChange={setUsername} msg={fields.username.msg} msgType={fields.username.type} />
            <Field id="loginPassword" type="password" placeholder="Password" value={password} onChange={setPassword} msg={fields.password.msg} msgType={fields.password.type} />
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="redirect">Don't have an account? <Link href="/sign-up">Sign Up</Link></p>
        </div>
      </div>
    </>
  );
}