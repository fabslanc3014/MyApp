'use client';
import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { api, auth, computeAge } from '@/lib/api';

type FieldState = { msg: string; type: 'ok' | 'error' | '' };
const blank = (): FieldState => ({ msg: '', type: '' });

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

export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '', full_name: '', nickname: '', address: '',
    birthday: '', contact: '', email: '', new_password: ''
  });
  const [fs, setFs] = useState<Record<string, FieldState>>({
    username: blank(), full_name: blank(), nickname: blank(), address: blank(),
    birthday: blank(), contact: blank(), email: blank(), new_password: blank()
  });
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; msg: string } | null>(null);
  const [originalUsername, setOriginalUsername] = useState('');
  const [loading, setLoading] = useState(false);

  function setF(name: string, ok: boolean, msg: string) {
    setFs(prev => ({ ...prev, [name]: { msg, type: ok ? 'ok' : 'error' } }));
  }

  function set(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  useEffect(() => {
    if (!auth.isAuthenticated()) { router.replace('/login'); return; }
    const username = auth.getUsername() || '';
    if (!username) return;

    api.getUser(username).then(res => {
      if (res.success && res.user) {
        const u = res.user;
        setOriginalUsername(u.username);
        setForm({
          username: u.username || '', full_name: u.full_name || '',
          nickname: u.nickname || '', address: u.address || '',
          birthday: u.birthday || '', contact: u.contact || '',
          email: u.email || '', new_password: ''
        });
      } else {
        setAlert({ type: 'error', msg: 'Could not load profile from server.' });
        setForm(prev => ({ ...prev, username }));
      }
    });
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    let valid = true;

    if (!form.username) { setF('username', false, 'Username is required.'); valid = false; } else setF('username', true, 'Good');
    if (!form.full_name) { setF('full_name', false, 'Full Name is required.'); valid = false; } else setF('full_name', true, 'Good');
    if (!form.nickname) { setF('nickname', false, 'Nickname is required.'); valid = false; } else setF('nickname', true, 'Good');
    if (!form.address) { setF('address', false, 'Address is required.'); valid = false; } else setF('address', true, 'Good');
    if (!form.birthday) { setF('birthday', false, 'Birthday is required.'); valid = false; }
    else if (new Date(form.birthday) >= new Date()) { setF('birthday', false, 'Must be a past date.'); valid = false; }
    else setF('birthday', true, 'Good');
    if (!form.contact) { setF('contact', false, 'Contact is required.'); valid = false; }
    else if (!/^\d{10,11}$/.test(form.contact)) { setF('contact', false, 'Must be 10–11 digits.'); valid = false; }
    else setF('contact', true, 'Good');
    if (!form.email) { setF('email', false, 'Email is required.'); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setF('email', false, 'Enter a valid email.'); valid = false; }
    else setF('email', true, 'Good');
    if (form.new_password && form.new_password.length < 8) {
      setF('new_password', false, 'Password must be at least 8 characters.'); valid = false;
    } else if (form.new_password) {
      setF('new_password', true, 'Good');
    }

    if (!valid) { setAlert({ type: 'error', msg: 'Please fix the errors before saving.' }); return; }

    setLoading(true);
    const age = computeAge(form.birthday);
    try {
      const res = await api.updateUser(originalUsername, { ...form, original_username: originalUsername, age });
      if (res.success) {
        auth.setUsername(res.user.username);
        setOriginalUsername(res.user.username);
        setAlert({ type: 'success', msg: 'Profile updated successfully!' });
        set('new_password', '');
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
      <Navbar
        showBlog
        rightContent={
          <div className="cta">
            <Link href="/home" className="btn">Back to Home</Link>
            <button className="btn" onClick={() => { auth.removeToken(); router.push('/login'); }}>Logout</button>
          </div>
        }
      />
      <div className="wrap-container">
        <div className="card">
          <h2>My Profile</h2>
          <p>Update your account information</p>

          {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <Field id="p_username" placeholder="Username" value={form.username} onChange={v => set('username', v)} fs={fs.username} />
            <Field id="p_full_name" placeholder="Full Name" value={form.full_name} onChange={v => set('full_name', v)} fs={fs.full_name} />
            <Field id="p_nickname" placeholder="Nickname" value={form.nickname} onChange={v => set('nickname', v)} fs={fs.nickname} />
            <Field id="p_address" placeholder="Address" value={form.address} onChange={v => set('address', v)} fs={fs.address} />
            <Field id="p_birthday" type="date" placeholder="Birthday" value={form.birthday} onChange={v => set('birthday', v)} fs={fs.birthday} />
            <Field id="p_contact" placeholder="Contact No." value={form.contact} onChange={v => set('contact', v)} fs={fs.contact} />
            <Field id="p_email" placeholder="Email" value={form.email} onChange={v => set('email', v)} fs={fs.email} />
            <Field id="p_new_password" type="password" placeholder="New Password (leave blank to keep current)" value={form.new_password} onChange={v => set('new_password', v)} fs={fs.new_password} />
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}