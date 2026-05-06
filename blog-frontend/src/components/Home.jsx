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
        //read articles of all authors
        let res=await axios.get(`${BASE_URL}/user-api/articles`,{withCredentials:true})
        //update articles state
        if(res.status===200){
          setArticles(await res.data.payload)
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
    <div>
      {/* ARTICLES SECTION */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4">Latest Articles</h3>
            {/* EMPTY STATE */}
            {articles.length === 0 ? (
              <p className="text-[#a1a1a6] text-sm text-center py-10">No articles available yet</p>
            ) : (
              <div className={articleGrid}>
                {articles.map((articleObj) => (
                  <div className={articleCardClass} key={articleObj._id}>
                    <div className="flex flex-col h-full">
                      {/* TOP */}
                      <div>
                        <p className={articleTitle}>{articleObj.title}</p>
    
                        <p className="text-sm text-[#6e6e73] mt-1">{articleObj.content.slice(0, 80)}...</p>
    
                        <p className={`${timestampClass} mt-2`}>{formatDateIST(articleObj.createdAt)}</p>
                      </div>
    
                      {/* ACTION */}
                      <button className={`${ghostBtn} mt-auto pt-4`} onClick={() => navigateToArticleByID(articleObj)}>
                        Read Article →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
      </div>
  );
}

export default Home;