import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted! Attempting to send to backend...'); // <--- Add this
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/posts', { title, content, tags });
      console.log('Success response:', response.data); // <--- Add this
      navigate('/'); 
    } catch (err) {
      console.error('Error response:', err.response); // <--- Add this
      setError(err.response?.data?.message || 'Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '30px auto', padding: '20px' }}>
      <h2>Create a New Blog Post</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter an engaging title..."
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', fontSize: '16px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Content (Markdown Supported)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article in Markdown format here... (# Heading, **bold**, etc.)"
            required
            rows={12}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', fontFamily: 'monospace', fontSize: '14px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="react, node, javascript"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '12px', background: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}
        >
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
}