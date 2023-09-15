import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Auth from "./Auth";
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
      <Route
        path="/test"
        element={
          <div className="App">
            <header className="App-header">
              <div>
                <p>
                  Hey I need you permission to send you some interesting
                  notifications
                </p>
                <button
                  onClick={() => {
                    Notification.requestPermission().then((result) => {
                      if (result === "granted") {
                        navigator.serviceWorker.ready.then((registration) => {
                          registration.showNotification("Vibration Sample", {
                            body: "Buzz! Buzz!",
                            icon: "/your-icon.png",
                            vibrate: [200, 100, 200, 100, 200, 100, 200],
                            tag: "vibration-sample",
                          });
                        });
                      }
                    });
                  }}
                >
                  Validate
                </button>
              </div>

              <div>
                <p>
                  Hey I need you permission to send you some webpush
                  notification
                </p>
                <button
                  onClick={() => {
                    Notification.requestPermission().then((result) => {
                      navigator.serviceWorker.ready.then((registration) => {
                        registration.pushManager
                          .subscribe({
                            userVisibleOnly: true,
                            applicationServerKey:
                              "BMZdk5HrjPfnNP2cDyH70dYm7uby9VRYr7DmCbMsfU0HXDKl2VERLk-W5NTOjC5ocgB9mvUT0eNZIcM3qxmQbJ0",
                          })
                          .then((subscription) => {
                            sendSubscriptionToServer(subscription);
                          })
                          .catch((error) => {
                            console.error("Push subscription error:", error);
                          });
                      });
                    });
                  }}
                >
                  Validate
                </button>
              </div>
            </header>
            <body></body>
          </div>
        }
      /> 
    </Routes>
  );
}

export default App;
