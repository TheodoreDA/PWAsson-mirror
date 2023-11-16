import React from "react";
import "./App.css";
import Auth from "./pages/Auth";
import Feed from "./pages/Feed";
import Post from "./pages/Post";
import Messages from "./pages/Messages";
import NewPost from "./pages/NewPost";
import Profile from "./pages/Profile";
import axios from "axios";
import { Route, Routes } from "react-router-dom";

function sendSubscriptionToServer(subscription) {
  console.log(subscription);

  axios.post("http://localhost:4200/subscribe", subscription).then((res) => {
    console.log(res);
  });
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<div> <p>home</p> </div>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/post" element={<Post />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/newpost" element={<NewPost />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    );
}

export default App;
