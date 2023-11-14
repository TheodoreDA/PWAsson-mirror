import { Link } from "react-router-dom";
import { IoMdArrowBack } from 'react-icons/io'
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import './Profile.css';
import { FaCpanel } from "react-icons/fa";

function Profile() {
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
                    <div>
                        <label>Notifications : </label>
                        <h3>Les notifications sont acceptées</h3>
                    </div>
                    <button type='submit'>Ne plus accepter</button>
                </div>
                <Link className="buttonAuth" to="/auth">
                    <button type='submit'>Se déconnecter</button>
                </Link>
            </div>
        </div>
    );
}

export default Profile;