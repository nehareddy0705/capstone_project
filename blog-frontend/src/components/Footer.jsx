import React from 'react'

function Footer() {
  return (
    <footer style={{
      width: '100%',
      padding: '1rem 0',
      textAlign: 'center',
      background: 'linear-gradient(90deg, #f8fafc 0%, #e0e7ef 100%)',
      color: '#222',
      position: 'fixed',
      left: 0,
      bottom: 0,
      boxShadow: '0 -2px 12px 0 rgba(0,0,0,0.06)',
      fontSize: '1rem',
      letterSpacing: '0.02em',
      zIndex: 100
    }}>
      <span style={{color: '#666', fontWeight: 400}}>
        All rights reserved.
      </span>
    </footer>
  )
}

export default Footer