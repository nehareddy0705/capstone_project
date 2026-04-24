import React, { useEffect } from 'react';

const BASE_URL = "https://capstone-project-blog-app-0eap.onrender.com";

function Home() {
  useEffect(() => {
    fetch(`${BASE_URL}/api/posts`)
      .then(res => res.json())
      .then(data => console.log(data));
  }, []);

  return (
    <div>Home</div>
  );
}

export default Home;