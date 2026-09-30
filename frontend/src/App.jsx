import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import API from './api/axios';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav style={{ padding: '15px 30px', background: '#333', color: '#fff', display: 'flex', gap: '20px', alignItems: 'center' }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>DevBlog</Link>
      
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/create" style={{ color: '#ffc107', textDecoration: 'none', fontWeight: 'bold' }}>+ Write Post</Link>
            <span style={{ fontSize: '14px', color: '#ddd' }}>Hi, {user.username}</span>
            <button 
              onClick={handleLogout} 
              style={{ padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get('/posts');
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div style={{ maxWidth: '840px', margin: '40px auto', padding: '0 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Blog Hero Banner */}
      <div style={{ marginBottom: '40px', textAlign: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', padding: '40px 20px', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>Welcome to DevBlog 🚀</h1>
        <p style={{ margin: '0', color: '#cbd5e1', fontSize: '16px' }}>Discover insights, tutorials, and thoughts from modern developers.</p>
      </div>

      <h2 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
        Latest Articles
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#334155' }}>Loading articles...</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '8px', color: '#334155' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '500' }}>No blog posts found yet.</p>
          <p style={{ margin: '0', fontSize: '14px' }}>Be the first developer to share something amazing!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {posts.map((singlePost) => (
            <article 
              key={singlePost._id} 
              style={{ 
                padding: '24px', 
                border: '1px solid #cbd5e1', 
                borderRadius: '12px', 
                background: '#ffffff', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.04)';
              }}
            >
              {/* Author & Date Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                  {singlePost.author?.username ? singlePost.author.username.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{singlePost.author?.username || 'Anonymous'}</span>
                  <span style={{ fontSize: '12px', color: '#475569', display: 'block' }}>{new Date(singlePost.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Title */}
              <Link to={`/posts/${singlePost._id}`} style={{ textDecoration: 'none' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '20px', fontWeight: '800', lineHeight: '1.4' }}>
                  {singlePost.title}
                </h3>
              </Link>

              {/* Snippet / Markdown Preview - Darker Text */}
              <div style={{ color: '#1e293b', lineHeight: '1.6', maxHeight: '80px', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '15px', fontWeight: '400', marginBottom: '16px' }}>
                <ReactMarkdown>{singlePost.content}</ReactMarkdown>
              </div>

              {/* Tags & Read More Link Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {singlePost.tags && singlePost.tags.map((tag, idx) => (
                    <span key={idx} style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#334155', fontWeight: '600', border: '1px solid #cbd5e1' }}>
                      #{tag}
                    </span>
                  ))}
                </div>

                <Link to={`/posts/${singlePost._id}`} style={{ fontSize: '14px', color: '#2563eb', textDecoration: 'none', fontWeight: '700' }}>
                  Read article &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </Router>
  );
}

App.displayName = 'App';