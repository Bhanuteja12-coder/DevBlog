import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import API from '../api/axios';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        setError('Could not load the post. It might have been deleted.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: '#fff' }}>Loading article...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '40px', color: '#f87171' }}>{error}</div>;
  if (!post) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', color: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#60a5fa', marginBottom: '20px', display: 'inline-block', fontWeight: '600' }}>
        &larr; Back to Home Feed
      </Link>
      
      <h1 style={{ fontSize: '32px', color: '#ffffff', marginBottom: '10px', fontWeight: '800' }}>{post.title}</h1>
      
      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '15px' }}>
        Written by <strong style={{ color: '#e2e8f0' }}>{post.author?.username || 'Anonymous'}</strong> on {new Date(post.createdAt).toLocaleDateString()}
      </p>

      <div style={{ lineHeight: '1.8', color: '#e2e8f0', fontSize: '16px' }}>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {post.tags && post.tags.length > 0 && (
        <div style={{ marginTop: '30px', display: 'flex', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid #334155', paddingTop: '20px' }}>
          {post.tags.map((tag, idx) => (
            <span key={idx} style={{ background: '#1e293b', border: '1px solid #475569', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', color: '#cbd5e1', fontWeight: '500' }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}