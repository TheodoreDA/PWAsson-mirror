import React from "react";
import './Auth.css';

function Login({ goToRegistration }) {
    function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
    }

    return (
        <div>
            <h1>Connexion</h1>
            <form method="post" onSubmit={handleSubmit}>
                Nom d'utilisateur: <br/><input name="username" placeholder="Nom d'utilisateur"/>
                Mot de passe: <br/><input type="password" name="password" placeholder="Mot de passe"/>
                <button type="submit">Se connecter</button>
            </form>
            <a onClick={goToRegistration}>Pas encore de compte ?</a>
        </div>
    );
}

function Register({ goToLogin }) {
    function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
    }

    return (
        <div>
            <h1>Inscription</h1>
            <form method="post" onSubmit={handleSubmit}>
                Nom d'utilisateur: <br/><input name="username" placeholder="Nom d'utilisateur"/>
                Mot de passe: <br/><input type="password" name="password" placeholder="Mot de passe"/>
                <button type="submit">S'inscrire</button>
            </form>
            <a onClick={goToLogin}>Déjà un compte ?</a>
        </div>
    );
}

function Auth() {
    const [isRegistered, setIsRegistered] = React.useState(true);

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