import { Link } from "react-router-dom";
import { IoMdArrowBack } from 'react-icons/io'
import './Profile.css';

function Profile () {
    const user = "Mr Poulpe";

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
                        <h3>{ user }</h3>
                    </div>
                    <div>
                        <label>Notifications : </label>
                        <h3>Les notifications sont acceptées</h3>
                    </div>
                        <button type='submit'>Ne plus accepter</button>
                    </div>
                <button type='submit'>Se déconnecter</button>
            </div>

        </div>
    );
}

export default Profile;