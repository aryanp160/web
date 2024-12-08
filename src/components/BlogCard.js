// src/components/BlogCard.js
import React from "react";
import "./BlogCard.css";

function BlogCard({ title, content }) {
  return (
    <div className="blog-card">
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  );
}

export default BlogCard;


