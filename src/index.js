import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Recipe from './pages/Recipe';
import Saved from './pages/Saved';
import Settings from './pages/Settings';
import reportWebVitals from './reportWebVitals';

<Route exact path="/home" component={Home} />

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    />
    <HashRouter basename='/'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe" element={<Recipe />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/settings" element={<Settings />} />
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
      <NavBar />
    </HashRouter>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
