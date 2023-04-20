import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Recipe from './pages/Recipe';
import Saved from './pages/Saved';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';
import DietaryRestrictions from './pages/settings/DietaryRestrictions';
import NutritionalPreferences from './pages/settings/NutritionalPreferences';
import FinancialPreferences from './pages/settings/FinancialPreferences';
import AppAppearance from './pages/settings/AppAppearance';
import reportWebVitals from './reportWebVitals';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "adaptipla.firebaseapp.com",
  databaseURL: "https://adaptipla-default-rtdb.firebaseio.com",
  projectId: "adaptipla",
  storageBucket: "adaptipla.appspot.com",
  messagingSenderId: "826210962785",
  appId: "1:826210962785:web:1ba40a0510126f3dc54920",
  measurementId: "G-235FB92HNR"
};

// Initialize Firebase
const app = initializeApp( firebaseConfig );
const analytics = getAnalytics( app );

const api = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com";
const apiKey = process.env.REACT_APP_API_KEY;
const apiHost = "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com";

const root = ReactDOM.createRoot( document.getElementById( 'root' ) );
root.render(
  <>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    />
    <HashRouter basename='/'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<Recipe />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<Search />} />
        <Route path="/settings/dietary-restrictions" element={<DietaryRestrictions />} />
        <Route path="/settings/nutritional-preferences" element={<NutritionalPreferences />} />
        <Route path="/settings/financial-preferences" element={<FinancialPreferences />} />
        <Route path="/settings/app-appearance" element={<AppAppearance />} />
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

export { app, api, apiKey, apiHost };
