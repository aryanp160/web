import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { AiOutlineLike, AiFillLike, AiFillDelete } from "react-icons/ai";
import { FiShare2 } from "react-icons/fi";
import "./BlogDetails.css";

const BlogDetails = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const blogDocRef = doc(db, "blogs", blogId);
      const blogSnapshot = await getDoc(blogDocRef);

      if (blogSnapshot.exists()) {
        setBlog({
          id: blogSnapshot.id,
          ...blogSnapshot.data(),
        });
      } else {
        alert("Blog not found!");
        navigate("/");
      }
    };

    fetchBlog();
  }, [blogId, navigate]);

  const handleLike = async () => {
    if (!auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const isLiked = blog.likedBy.includes(userId);
    const updatedBlog = {
      ...blog,
      likes: isLiked ? blog.likes - 1 : blog.likes + 1,
      likedBy: isLiked
        ? blog.likedBy.filter((uid) => uid !== userId)
        : [...blog.likedBy, userId],
    };

    const blogDocRef = doc(db, "blogs", blogId);
    await updateDoc(blogDocRef, {
      likes: updatedBlog.likes,
      likedBy: updatedBlog.likedBy,
    });

    setBlog(updatedBlog);
  };

  const handleShare = async () => {
    const blogUrl = `${window.location.origin}/blog/${blogId}`;

    try {
      await navigator.clipboard.writeText(blogUrl);
      alert("Blog link copied to clipboard!");
    } catch (error) {
      alert("Failed to copy the link. Please try again.");
      console.error("Error copying link: ", error);
    }

    const updatedBlog = {
      ...blog,
      shares: (blog.shares || 0) + 1,
    };

    const blogDocRef = doc(db, "blogs", blogId);
    await updateDoc(blogDocRef, { shares: updatedBlog.shares });
    setBlog(updatedBlog);
  };

  const handleDelete = async () => {
    if (auth.currentUser && auth.currentUser.uid === blog.uid) {
      const blogDocRef = doc(db, "blogs", blogId);
      await deleteDoc(blogDocRef);
      alert("Blog deleted successfully!");
      navigate("/");
    } else {
      alert("You are not authorized to delete this blog.");
    }
  };

  const formatContent = (content) => {
    return content.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  if (!blog) {
    return <p>Loading blog details...</p>;
  }

  return (
    <div className="blog-details-container">
      <h1 className="blog-title">{blog.title}</h1>
      <h4 className="author">--by {blog.author}</h4>
      <div className="blog-content">{formatContent(blog.content)}</div>
      <div className="blog-actions">
        <button
          className="like-btn"
          onClick={handleLike}
          style={{ display: "flex", alignItems: "center", fontSize: "16px" }}
        >
          {blog.likedBy.includes(auth.currentUser?.uid) ? (
            <AiFillLike style={{ fontSize: "20px", marginRight: "8px" }} />
          ) : (
            <AiOutlineLike style={{ fontSize: "20px", marginRight: "8px" }} />
          )}
          Like <span className="like-count">({blog.likes || 0})</span>
        </button>
        <button
          className="share-btn"
          onClick={handleShare}
          style={{ display: "flex", alignItems: "center", fontSize: "16px" }}
        >
          <FiShare2 style={{ fontSize: "20px", marginRight: "8px" }} />
          Share <span className="share-count">({blog.shares || 0})</span>
        </button>
        {auth.currentUser && auth.currentUser.uid === blog.uid && (
          <button
            className="delete-btn"
            onClick={handleDelete}
            style={{ display: "flex", alignItems: "center", fontSize: "16px" }}
          >
            <AiFillDelete style={{ fontSize: "20px", marginRight: "8px" }} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;


