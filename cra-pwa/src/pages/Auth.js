import { useState } from "react";
import './Auth.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ goToRegistration }) {
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        axios.post(process.env.REACT_APP_API + "/auth/login", {
            username: formJson.username,
            password: formJson.password
        }).then((res) => {
            localStorage.setItem("token", res.data);
            localStorage.setItem("username", formJson.username);
            navigate("/feed");
        }).catch((err) => {
            console.log(err);
            alert("Username ou passwpord incorrect");
        });
    }

    return (
        <div>
            <h1>Connexion</h1>
            <form method="post" onSubmit={handleSubmit}>
                Nom d'utilisateur: <br/><input name="username" placeholder="Nom d'utilisateur"/>
                Mot de passe: <br/><input type="password" name="password" placeholder="Mot de passe"/>
                <button type="submit">Se connecter</button>
            </form>
            <div className="redirect" onClick={goToRegistration}>Pas encore de compte ?</div>
        </div>
    );
}

function Register({ goToLogin }) {
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        axios.post(process.env.REACT_APP_API + "/auth/register", {
            username: formJson.username,
            password: formJson.password
        }).then((res) => {
            localStorage.setItem("token", res.data);
            localStorage.setItem("username", formJson.username);
            navigate("/feed");
        }).catch((err) => {
            console.log(err);
            alert("User couldn't be created");
        });        
    }

    return (
        <div>
            <h1>Inscription</h1>
            <form method="post" onSubmit={handleSubmit}>
                Nom d'utilisateur: <br/><input name="username" placeholder="Nom d'utilisateur"/>
                Mot de passe: <br/><input type="password" name="password" placeholder="Mot de passe"/>
                <button type="submit">S'inscrire</button>
            </form>
            <div className="redirect" onClick={goToLogin}>Déjà un compte ?</div>
        </div>
    );
}

function Auth() {
    const [isRegistered, setIsRegistered] = useState(true);

    let updateState = (() => setIsRegistered(prevIsRegistered => !prevIsRegistered));
    return (
        <div className="Auth">
            { isRegistered
                ? <Login goToRegistration={updateState}/>
                : <Register goToLogin={updateState}/>
            }
        </div>
    );
}

export default Auth;