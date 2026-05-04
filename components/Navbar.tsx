'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';

interface NavbarProps {
  showBlog?: boolean;
  loggedIn?: boolean;
  username?: string;
  rightContent?: React.ReactNode;
}

export default function Navbar({ showBlog, loggedIn, username, rightContent }: NavbarProps) {
  const router = useRouter();

  function logout() {
    auth.removeToken();
    router.push('/login');
  }

  return (
    <header>
      <Link href="/home" className="container-logo">
        <span>WeConnect</span>
      </Link>
      <nav>
        <ul className="nav-links">
          <li><Link href="/home">Home</Link></li>
          <li><a href="#">About</a></li>
          {showBlog && <li><a href="#">Blog</a></li>}
        </ul>
      </nav>
      <div className="cta">
        {rightContent ?? (
          loggedIn ? (
            <>
              <span>Hi, {username}</span>
              <Link href="/profile" className="btn">Profile</Link>
              <button className="btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/sign-up" className="btn">Sign Up</Link>
              <Link href="/login" className="btn">Login</Link>
            </>
          )
        )}
      </div>
    </header>
  );
}