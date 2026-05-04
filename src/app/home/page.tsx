'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { auth } from '@/lib/api';

const POSTS = [
  {
    img: 'images/car.jpg',
    title: 'Porsche Review',
    body: "Built for the Porsche community, by the Porsche community. A space where fans, owners, and dreamers come together to share their love for the brand. Expect honest reviews, heated debates, and stories straight from the driver's seat.",
  },
  {
    img: 'images/venice.jpg',
    title: 'Venice the Alps',
    body: 'Two destinations. One unforgettable escape. Venice enchants with its golden light and ancient charm. The Alps inspire with their silence and scale. Together, they make one of the most extraordinary journeys Europe has to offer.',
  },
  {
    img: 'images/cuisine.jpg',
    title: 'Chinese Cuisine',
    body: 'Chinese cuisine is a diverse, ancient culinary tradition built on balancing color, aroma, flavor, and texture, often emphasizing harmony, health, and shared dining.',
  },
  {
    img: 'images/tech.jpg',
    title: 'Tech Today',
    body: 'Chinese cuisine is a diverse, ancient culinary tradition built on balancing color, aroma, flavor, and texture, often emphasizing harmony, health, and shared dining.',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!auth.isAuthenticated()) { router.replace('/login'); return; }
    setUsername(auth.getUsername() || 'User');
  }, [router]);

  if (!username) return null;

  return (
    <>
      <Navbar
        showBlog
        loggedIn
        username={username}
        rightContent={
          <div className="cta">
            <span>Hi, {username}</span>
            <Link href="/profile" className="btn">Profile</Link>
            <button className="btn" onClick={() => { auth.removeToken(); router.push('/login'); }}>Logout</button>
          </div>
        }
      />

      <section className="hero">
        <p className="section-label">Welcome to Weconnect</p>
        <h1>Create your own Stories</h1>
      </section>

      <section className="blog-section">
        <p className="section-label">Latest Post</p>
        <h2>Stories from the community</h2>
      </section>

      <div className="blog-grid">
        {POSTS.map(post => (
          <div className="blog-card" key={post.title}>
            {}
            <img src={post.img} alt={post.title} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div className="blog-body">
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}