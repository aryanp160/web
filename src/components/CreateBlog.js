// src/components/CreateBlog.js
import React, { useState } from 'react';
import { db, auth } from '../firebase'; // Assuming db and auth are initialized
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './CreateBlog.css';
const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the user is logged in
    if (auth.currentUser) {
      try {
        const blogData = {
          title,
          content,
          author: auth.currentUser.email,  // Store the author's email (or UID)
          uid: auth.currentUser.uid, // Store the author's UID
          createdAt: new Date(),
        };

        await addDoc(collection(db, 'blogs'), blogData);
        navigate('/');  // Redirect to home after blog creation
      } catch (error) {
        console.error('Error creating blog: ', error);
      }
    }
  };

  return (
    <div className="create-blog-container">
      <h2>Create Blog</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-submit">Create Blog</button>
      </form>
    </div>
  );
};

export default CreateBlog;
