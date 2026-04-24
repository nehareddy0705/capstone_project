import React from 'react'
// src/components/Home.jsx

const BASE_URL = "https://capstone-project-blog-app-0eap.onrender.com";

useEffect(() => {
  fetch(`${BASE_URL}/api/posts`)
    .then(res => res.json())
    .then(data => console.log(data));
}, []);
function Home() {
  return (
    <div>Home</div>
  )
}

export default Home