import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {  BrowserRouter as Router,  Route,  Routes } from 'react-router-dom';

import StartPage from './startPage';
import MessageEditor from './messageEditor';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
    <Router>      
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/editor" element={<MessageEditor />} />
        </Routes>
    </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
