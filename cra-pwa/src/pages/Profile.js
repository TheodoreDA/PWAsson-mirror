import { Link } from "react-router-dom";
import { IoMdArrowBack } from 'react-icons/io'
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import './Profile.css';
import notificationLogo from "../assets/instagram-64.png"

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

const WebPushNotifications = () => {
    const [webPushNotification, setWebPushNotification] = useState(true);

    useEffect(() => {
        const getUserWebPushNotificationAcceptance = async () => {
            try {
                const response = await axios.get(
                    process.env.REACT_APP_API + "/user/isNotifAllowed",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setWebPushNotification(response.data);
            }
            catch (error) {
                console.log(error);
            }
        };
        getUserWebPushNotificationAcceptance();
    }, []);

    const sendSubscriptionToServer = async (subscription) => {
        await axios.post(
            process.env.REACT_APP_API + "/notification/acceptNotification",
            subscription,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
    }

    const acceptWebPushNotification =  () => {
        setWebPushNotification(true)
        navigator.serviceWorker.ready.then((registration) => {
            registration.pushManager
            .subscribe({
                userVisibleOnly: true,
                applicationServerKey:
                "BIrxem2ATCIG3x814Yo6IglnsP8oGPdHZz9iAXtB3xw4EzlNvhoDNSzKTfj9YgGIllco-O9wiGXhxWRlPGP3tAI",
            })
            .then(async (subscription) => {
                await sendSubscriptionToServer(subscription);
            })
            .catch((error) => {
                console.error("Push subscription error:", error);
                setWebPushNotification(false)
            });
        });
    }

    const removeWebPushNotification = async () => {
        console.log("remove webpush", webPushNotification)
        setWebPushNotification(false)
        axios.post(
            process.env.REACT_APP_API + "/notification/revokeNotification",
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        ).then((res) => {
        }).catch((error) => {
            console.error("Push subscription error:", error);
            setWebPushNotification(true)
        });
    }

    if (webPushNotification) {
        return (
            <>
                <p> Remove webpush notification </p>
                <button onClick={removeWebPushNotification}> Remove </button>
            </>
        )
    } else {
        return (
            <>
                <p>
                    Hey I need you permission to send you some webpush notification
                </p>
                <button
                onClick={acceptWebPushNotification}
                    >
                Validate
                </button>
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
            const response = await axios.get(process.env.REACT_APP_API + `/user/${userId}`);
            setUsername(response.data?.username);
        }
        fetchData();
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href = "/auth";
    }

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
                    <WebPushNotifications />
                    </div>
                <button type='submit' onClick={handleLogout}>Se déconnecter</button>
            </div>
        </div>
    );
}

export default Profile;