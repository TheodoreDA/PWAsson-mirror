import { Link } from "react-router-dom";
import { IoMdArrowBack } from 'react-icons/io'
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import './Profile.css';
import { FaCpanel } from "react-icons/fa";
import notificationLogo from "../assets/instagram.png"
import { useEffect, useState } from "react";
import notificationLogo from "../assets/instagram.png"

const Notifications = () => {
    const [notificationStatus, setNotificationStatus] = useState(Notification.permission);
    
    const handleRevokePermissionClick = () => {
        // Provide information to the user on how to manage site settings
        alert('To revoke notification permission, go to your browser settings and find the site in the list of allowed or blocked notifications.');
    };

    switch (notificationStatus) {
        case 'default':
            return (
                <>
                    <p>
                        Hey I need you permission to send you some interesting
                        notifications
                    </p>
                    <button
                        onClick={() => {
                            Notification.requestPermission().then((result) => {
                                if (result === "granted") {
                                    setNotificationStatus(Notification.permission);
                                    new Notification('Custom Notification', {
                                        body: 'This is a custom notification body.',
                                        icon: notificationLogo,
                                        vibrate: [200, 100, 200, 100, 200, 100, 200],
                                    });
                                }
                                else if (result === "denied")
                                    setNotificationStatus(Notification.permission);
                            })
                        }}
                    >
                        accepter
                    </button>
                </>
            )
        case 'denied':
            return (
                <>
                    <p> Hey you already refuse the notification you need to reset the permission to have it</p>
                </>
            )
        case 'granted':
            return (
                <>
                    <p> Remove notifications </p>
                    <button onClick={handleRevokePermissionClick}> Remove </button>
                </>
            )
        default:
            return (
                <>
                    <p> Hey you already refuse the notification you need to reset the permission to have it</p>
                </>
            )
    }
}

function Profile () {
    const [username, setUsername] = useState();
    const token = localStorage.getItem("token");
    const jwtToken = jwtDecode(token)
    const userId = jwtToken.uid;

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get(`http://localhost:8080/user/${userId}`);
            setUsername(response.data?.username);
        }
        fetchData();
    })

    return (
        <div className="Profile">
            <div className="header">
                <Link to='/feed' className='return-cursor'><IoMdArrowBack />Retour</Link>
                <h1>Profil</h1>
            </div>
            <div className="body">
                <div>
                    <div>
                        <label>Nom d'utilisateur : </label>
                        <h3>{localStorage.getItem("username")}</h3>
                    </div>
                    <Notifications />
                    </div>
                <button type='submit'>Se déconnecter</button>
            </div>
        </div>
    );
}

export default Profile;