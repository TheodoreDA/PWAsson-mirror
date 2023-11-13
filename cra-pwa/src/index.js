import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Auth from './pages/Auth';
import Feed from './pages/Feed';
import Post from "./pages/Post";
import Messages from "./pages/Messages";
import NewPost from "./pages/NewPost";
import Profile from "./pages/Profile";

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/auth",
    element: <Auth />
  },
  {
    path: "/feed",
    element: <Feed />
  },
  {
    path: "/post",
    element: <Post />
  },
  {
    path: "/messages",
    element: <Messages />
  },
  {
    path: "/newpost",
    element: <NewPost />
  },
  {
    path: "/profile",
    element: <Profile />
  },
])
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
