import React, { useEffect, useState } from 'react';
import { articleGrid, articleCardClass, articleTitle, articleExcerpt, articleMeta } from '../styles/common.js';
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { timestampClass, ghostBtn, loadingClass } from "../styles/common.js";
const BASE_URL = import.meta.env.VITE_API_URL;

function Home(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      try {
        // Use public endpoint for articles
        let res = await axios.get(`${BASE_URL}/user-api/public-articles`);
        if (res.status === 200) {
          setArticles(res.data.payload);
        }
      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    getArticles();
  }, []);

  const formatDateIST = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };
  const navigateToArticleByID = (articleObj) => {
    navigate(`/article/${articleObj._id}`, {
      state: articleObj,
    });
  };

  if (loading) {
    return <p className={loadingClass}>Loading articles...</p>;
  }

  return (
    <main className="bg-white min-h-screen">
      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
        <h1 className="text-5xl font-bold text-[#1d1d1f] tracking-tight leading-tight mb-3">Welcome to MyBlog</h1>
        <p className="text-lg text-[#6e6e73] max-w-2xl mx-auto mb-7">Discover, read, and share insightful articles from authors around the world. Dive into trending topics, personal stories, and expert advice—all in one place.</p>
        
      </section>

      {/* ARTICLES SECTION */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6 text-left">Latest Articles</h2>
        {/* ERROR STATE */}
        {error && (
          <div className="bg-[#ff3b30]/6 text-[#cc2f26] border border-[#ff3b30]/18 rounded-xl px-4 py-3 text-sm mb-8 text-center">
            {error}
          </div>
        )}
        {/* EMPTY STATE */}
        {articles.length === 0 ? (
          <div className="text-center text-[#a1a1a6] py-16 text-base">No articles available yet. Be the first to write one!</div>
        ) : (
          <div className={articleGrid}>
            {articles.map((articleObj) => (
              <div
                className={articleCardClass + " group relative flex flex-col h-full border border-[#e8e8ed] hover:shadow-lg transition-shadow"}
                key={articleObj._id}
                onClick={() => navigateToArticleByID(articleObj)}
                style={{ cursor: "pointer" }}
              >
                <div className="flex flex-col h-full">
                  {/* Article Title */}
                  <p className={articleTitle + " text-lg group-hover:text-[#0066cc] transition-colors mb-1"}>{articleObj.title}</p>
                  {/* Excerpt */}
                  <p className={articleExcerpt + " mb-2"}>{articleObj.content.slice(0, 100)}...</p>
                  {/* Meta */}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className={timestampClass}>{formatDateIST(articleObj.createdAt)}</span>
                    <button
                      className={ghostBtn + " text-xs px-2 py-1 rounded-full border border-[#e8e8ed] hover:bg-[#e8e8ed] transition-colors"}
                      onClick={e => { e.stopPropagation(); navigateToArticleByID(articleObj); }}
                    >
                      Read →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;