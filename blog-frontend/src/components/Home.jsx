import React, { useEffect, useState } from 'react';
import { articleGrid, articleCardClass, articleTitle, articleExcerpt, articleMeta } from '../styles/common.js';

const BASE_URL = import.meta.env.VITE_API_URL;



function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/author-api/articles`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch articles');
        return res.json();
      })
      .then(data => {
        setArticles(data.articles || data); // handle both { articles: [...] } and [...] formats
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="py-10 text-center">Loading articles...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">All Articles</h1>
      {articles.length === 0 ? (
        <div>No articles found.</div>
      ) : (
        <div className={articleGrid}>
          {articles.map(article => (
            <div key={article._id || article.id} className={articleCardClass}>
              <div className={articleTitle}>{article.title}</div>
              <div className={articleExcerpt}>{article.excerpt || article.content?.slice(0, 100) + '...'}</div>
              <div className={articleMeta}>
                {article.authorName || article.author || 'Unknown Author'} &middot; {new Date(article.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;