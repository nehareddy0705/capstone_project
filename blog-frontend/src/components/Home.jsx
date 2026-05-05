import React, { useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL;


function Home() {
  useEffect(() => {
    fetch(`${BASE_URL}/author-api/articles`)
      .then(res => res.json())
      .then(data => console.log(data));
  }, []);

  return (
    <div>Home</div>
  );
}

export default Home;