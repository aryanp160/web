// src/components/BlogList.js
import React, { useState } from "react";
import BlogCard from "./BlogCard";

function BlogList() {
  const [blogs] = useState([
    { title: "Welcome to Blogging!", content: "This is the first blog post." },
  ]);

  return (
    <div>
      {blogs.map((blog, index) => (
        <BlogCard key={index} title={blog.title} content={blog.content} />
      ))}
    </div>
  );
}

export default BlogList;
