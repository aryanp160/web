import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { AiOutlineLike, AiFillLike, AiFillDelete } from 'react-icons/ai'; // Import like and delete icons
import { FiShare2 } from 'react-icons/fi'; // Import share icon
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [expandedBlog, setExpandedBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogsCollection = collection(db, 'blogs');
      const blogSnapshot = await getDocs(blogsCollection);
      const blogList = blogSnapshot.docs.map(doc => ({
        id: doc.id,
        likes: 0,
        shares: 0,
        likedBy: [], // Default likedBy if not in Firestore
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

  const handleLike = async (id) => {
    if (!auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const updatedBlogs = blogs.map(blog => {
      if (blog.id === id) {
        const isLiked = blog.likedBy.includes(userId);
        const updatedBlog = {
          ...blog,
          likes: isLiked ? blog.likes - 1 : blog.likes + 1,
          likedBy: isLiked
            ? blog.likedBy.filter(uid => uid !== userId) // Remove user from likedBy
            : [...blog.likedBy, userId], // Add user to likedBy
        };

        const blogDocRef = doc(db, 'blogs', id);
        updateDoc(blogDocRef, {
          likes: updatedBlog.likes,
          likedBy: updatedBlog.likedBy,
        });

        return updatedBlog;
      }
      return blog;
    });

    setBlogs(updatedBlogs);
  };

  const handleShare = async (id) => {
    const updatedBlogs = blogs.map(blog => {
      if (blog.id === id) {
        const updatedBlog = { ...blog, shares: (blog.shares || 0) + 1 };
        const blogDocRef = doc(db, 'blogs', id);
        updateDoc(blogDocRef, { shares: updatedBlog.shares });
        return updatedBlog;
      }
      return blog;
    });
    setBlogs(updatedBlogs);
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
            <Link to={`/blog/${blog.id}`} className="blog-title-link" >
                <h3 >{blog.title}</h3>
              </Link>

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
                <AiFillDelete /> Delete
              </button>
            )}
            <div className="blog-actions">
                <button
                  className="like-btn"
                  onClick={() => handleLike(blog.id)}
                  style={{ display: 'flex', alignItems: 'center', fontSize: '16px' }} // Adjusted styles for alignment and spacing
                >
                  {blog.likedBy.includes(auth.currentUser?.uid) ? (
                    <AiFillLike style={{ fontSize: '20px', marginRight: '8px' }} /> // Icon size and spacing
                  ) : (
                    <AiOutlineLike style={{ fontSize: '20px', marginRight: '8px' }} />
                  )}
                  Like <span className="like-count">({blog.likes || 0})</span>
                </button>
                <button
                  className="share-btn"
                  onClick={() => handleShare(blog.id)}
                  style={{ display: 'flex', alignItems: 'center', fontSize: '16px' }}
                >
                  <FiShare2 style={{ fontSize: '20px', marginRight: '8px' }} />
                  Share <span className="share-count">({blog.shares || 0})</span>
                </button>
                {auth.currentUser && auth.currentUser.uid === blog.uid && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(blog.id, blog.uid)}
                    style={{ display: 'flex', alignItems: 'center', fontSize: '16px' }}
                  >
                    <AiFillDelete style={{ fontSize: '20px', marginRight: '8px' }} />
                    Delete
                  </button>
                )}
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
