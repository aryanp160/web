import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './Home.css';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [expandedBlog, setExpandedBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogsCollection = collection(db, 'blogs');
      const blogSnapshot = await getDocs(blogsCollection);
      const blogList = blogSnapshot.docs.map(doc => ({
        id: doc.id,
        likes: 0, // Default likes if not in Firestore
        shares: 0, // Default shares if not in Firestore
        ...doc.data(),
      }));
      setBlogs(blogList);
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id, uid) => {
    if (auth.currentUser && auth.currentUser.uid === uid) {
      try {
        const blogDocRef = doc(db, 'blogs', id);
        await deleteDoc(blogDocRef);
        setBlogs(blogs.filter(blog => blog.id !== id));
      } catch (error) {
        console.error('Error deleting blog: ', error);
      }
    } else {
      alert('You are not authorized to delete this blog.');
    }
  };

  const handleSeeMore = (id) => {
    setExpandedBlog(expandedBlog === id ? null : id);
  };

  const handleLike = (id) => {
    setBlogs(prevBlogs =>
      prevBlogs.map(blog =>
        blog.id === id ? { ...blog, likes: blog.likes + 1 } : blog
      )
    );
  };

  const handleShare = (id) => {
    setBlogs(prevBlogs =>
      prevBlogs.map(blog =>
        blog.id === id ? { ...blog, shares: blog.shares + 1 } : blog
      )
    );
    alert('Blog shared successfully!');
  };

  const getShortContent = (content) => {
    const words = content.split(' ');
    return words.slice(0, 35).join(' ') + (words.length > 35 ? '...' : '');
  };

  const formatContent = (content) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="container">
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <div key={blog.id} className="blog-post">
            <h3>{blog.title}</h3>
            <h4 className="author-subtitle">by {blog.author}</h4>
            <p>
              {expandedBlog === blog.id ? formatContent(blog.content) : getShortContent(blog.content)}
            </p>
            {blog.content.split(' ').length > 35 && (
              <span className="see-more" onClick={() => handleSeeMore(blog.id)}>
                {expandedBlog === blog.id ? 'See Less' : 'See More'}
              </span>
            )}
            {auth.currentUser && auth.currentUser.uid === blog.uid && (
              <button className="delete-btn" onClick={() => handleDelete(blog.id, blog.uid)}>
                Delete Blog
              </button>
            )}
            <div className="blog-actions">
              <button className="like-btn" onClick={() => handleLike(blog.id)}>
                Like <span className="like-count">({blog.likes})</span>
              </button>
              <button className="share-btn" onClick={() => handleShare(blog.id)}>
                Share <span className="share-count">({blog.shares})</span>
              </button>
            </div>
            <hr />
          </div>
        ))
      ) : (
        <p>No blogs available.</p>
      )}
    </div>
  );
};

export default Home;
