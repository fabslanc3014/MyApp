'use client';
import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { api, computeAge } from '@/lib/api';

type FieldState = { msg: string; type: 'ok' | 'error' | '' };
type User = Record<string, string>;

function Field({ id, type = 'text', placeholder, value, onChange, fs }: {
  id: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; fs: FieldState;
}) {
  return (
    <div className="field">
      <input id={id} type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        className={fs.type === 'ok' ? 'input-ok' : fs.type === 'error' ? 'input-error' : ''} />
      {fs.msg && <span className={`msg ${fs.type}`}>{fs.msg}</span>}
    </div>
  );
}

const blank = (): FieldState => ({ msg: '', type: '' });

export default function SignUpPage() {
  const [form, setForm] = useState({
    username: '', full_name: '', nickname: '', address: '',
    birthday: '', contact: '', email: '', password: ''
  });
  const [fs, setFs] = useState<Record<string, FieldState>>({
    username: blank(), full_name: blank(), nickname: blank(), address: blank(),
    birthday: blank(), contact: blank(), email: blank(), password: blank()
  });
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; msg: string } | null>(null);
  const [submitted, setSubmitted] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);

  function setF(name: string, ok: boolean, msg: string) {
    setFs(prev => ({ ...prev, [name]: { msg, type: ok ? 'ok' : 'error' } }));
  }

  function set(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function validate(f: typeof form): boolean {
    let ok = true;
    if (!f.username) { setF('username', false, 'Username is required.'); ok = false; } else setF('username', true, 'Good');
    if (!f.full_name) { setF('full_name', false, 'Full Name is required.'); ok = false; } else setF('full_name', true, 'Good');
    if (!f.nickname) { setF('nickname', false, 'Nickname is required.'); ok = false; } else setF('nickname', true, 'Good');
    if (!f.address) { setF('address', false, 'Address is required.'); ok = false; } else setF('address', true, 'Good');
    if (!f.birthday) { setF('birthday', false, 'Birthday is required.'); ok = false; }
    else if (new Date(f.birthday) >= new Date()) { setF('birthday', false, 'Birthday must be a past date.'); ok = false; }
    else setF('birthday', true, 'Good');
    if (!f.contact) { setF('contact', false, 'Contact No. is required.'); ok = false; }
    else if (!/^\d{10,11}$/.test(f.contact)) { setF('contact', false, 'Must be 10–11 digits, numbers only.'); ok = false; }
    else setF('contact', true, 'Good');
    if (!f.email) { setF('email', false, 'Email is required.'); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) { setF('email', false, 'Enter a valid email address.'); ok = false; }
    else setF('email', true, 'Good');
    if (!f.password) { setF('password', false, 'Password is required.'); ok = false; }
    else if (f.password.length < 8) { setF('password', false, 'Password must be at least 8 characters.'); ok = false; }
    else setF('password', true, 'Good');
    return ok;
  }

  async function loadUsers() {
    const res = await api.getUsers();
    if (res.success) setUsers(res.users);
  }

  useEffect(() => { loadUsers(); }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate(form)) {
      setAlert({ type: 'error', msg: 'Please fix the errors and missing fields before submitting.' });
      setSubmitted(null);
      return;
    }
    setLoading(true);
    const age = computeAge(form.birthday);
    try {
      const res = await api.register({ ...form, age });
      if (res.success) {
        setAlert({ type: 'success', msg: `Account created successfully! Welcome, ${form.username}!` });
        setSubmitted({ ...form, age });
        setForm({ username: '', full_name: '', nickname: '', address: '', birthday: '', contact: '', email: '', password: '' });
        setFs({ username: blank(), full_name: blank(), nickname: blank(), address: blank(), birthday: blank(), contact: blank(), email: blank(), password: blank() });
        loadUsers();
      } else {
        setAlert({ type: 'error', msg: res.message });
      }
    } catch {
      setAlert({ type: 'error', msg: 'Server error. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(username: string) {
    if (!confirm(`Are you sure you want to delete "${username}"? This cannot be undone.`)) return;
    const res = await api.deleteUser(username);
    if (res.success) { loadUsers(); }
    else window.alert('Could not delete user: ' + res.message);
  }

  function runSearch() {
    const q = searchQuery.trim().toLowerCase();
    if (!q) { setSearchResults(null); return; }
    const matches = users.filter(u =>
      (u.username || '').toLowerCase().includes(q) ||
      (u.full_name || '').toLowerCase().includes(q) ||
      (u.nickname || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
    setSearchResults(matches);
  }

  const displayFields = submitted
    ? Object.entries(submitted).map(([k, v]) => ({ key: k, value: k === 'password' ? '••••••••' : v, isAge: k === 'age' }))
    : [];

  return (
    <>
      <Navbar rightContent={<Link href="/login" className="btn">Login</Link>} />
      <div className="wrap-container">
        <div className="card">
          <h2>Join the Community</h2>
          <p>Create your own Blog Profile</p>

          {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <Field id="username" placeholder="Username" value={form.username} onChange={v => set('username', v)} fs={fs.username} />
            <Field id="full_name" placeholder="Full Name" value={form.full_name} onChange={v => set('full_name', v)} fs={fs.full_name} />
            <Field id="nickname" placeholder="Nickname" value={form.nickname} onChange={v => set('nickname', v)} fs={fs.nickname} />
            <Field id="address" placeholder="Address" value={form.address} onChange={v => set('address', v)} fs={fs.address} />
            <Field id="birthday" type="date" placeholder="Birthday" value={form.birthday} onChange={v => set('birthday', v)} fs={fs.birthday} />
            <Field id="contact" placeholder="Contact No." value={form.contact} onChange={v => set('contact', v)} fs={fs.contact} />
            <Field id="email" placeholder="Email" value={form.email} onChange={v => set('email', v)} fs={fs.email} />
            <Field id="password" type="password" placeholder="Password" value={form.password} onChange={v => set('password', v)} fs={fs.password} />
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          {submitted && displayFields.length > 0 && (
            <div className="output-container">
              <h3>Submitted Details</h3>
              {displayFields.map(({ key, value, isAge }) => (
                <div className="output-row" key={key}>
                  <strong>{key}</strong>
                  <span>{isAge ? <span className="age-badge">{value}</span> : value}</span>
                </div>
              ))}
            </div>
          )}

          <p className="redirect">Already have an account? <Link href="/login">Login</Link></p>

          <div className="search-section">
            <div className="search-bar-row">
              <input type="text" placeholder="Search registered users…" value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && runSearch()} />
              <button className="btn" onClick={runSearch} type="button">
                Search
              </button>
            </div>
            {searchResults !== null && (
              <div className="search-results">
                {searchResults.length === 0
                  ? <p>No users found</p>
                  : searchResults.map(u => (
                    <div className="search-result-item" key={u.username}>
                      <strong>{u.username}</strong>
                      <span>{u.full_name} &bull; {u.email}</span>
                      <span>{u.address} &bull; {u.contact}</span>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      </div>

      {users.length > 0 && (
        <div className="users-log">
          <h3>All Registered Users</h3>
          {users.map((u, i) => (
            <div className="user-entry" key={u.username}>
              <div className="entry-header">
                <span>User #{i + 1} – {u.username}</span>
                <div className="entry-actions">
                  <button className="btn-danger-outline" onClick={() => handleDelete(u.username)}>Remove</button>
                </div>
              </div>
              {Object.entries(u).map(([k, v]) => (
                <div className="entry-row" key={k}>
                  <span>{k}</span>
                  <span>{k === 'age' ? <span className="age-badge">{v}</span> : v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}