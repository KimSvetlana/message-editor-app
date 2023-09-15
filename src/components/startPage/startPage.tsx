import React from 'react';
import './startPage.css';
import { Link } from 'react-router-dom';

function StartPage() {
  return (
    <div className="start-page">
      <div className="page-content">
        Welcome to
        <Link to="/editor" className='button'>Message Editor</Link>  
      </div>
    </div>
  );
}

export default StartPage;
